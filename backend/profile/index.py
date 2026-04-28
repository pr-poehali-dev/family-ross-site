"""Кабинет участника: профиль, ранг, выговора по session_token."""
import json
import os
import psycopg2
from datetime import datetime

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Session-Token',
}


def conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    headers = event.get('headers') or {}
    session_token = headers.get('X-Session-Token') or headers.get('x-session-token', '')

    if not session_token:
        return {'statusCode': 401, 'headers': CORS, 'body': {'error': 'unauthorized'}}

    db = conn()
    cur = db.cursor()

    cur.execute(
        """
        SELECT u.id, u.vk_id, u.vk_name, u.vk_photo, u.member_id, u.session_expires,
               m.name, m.rank, m.rank_color,
               u.discord_id, u.discord_name, u.discord_avatar, u.is_admin
        FROM users u
        LEFT JOIN members m ON m.id = u.member_id
        WHERE u.session_token = %s
        """,
        (session_token,),
    )
    row = cur.fetchone()

    if not row:
        cur.close()
        db.close()
        return {'statusCode': 401, 'headers': CORS, 'body': {'error': 'invalid session'}}

    user_id, vk_id, vk_name, vk_photo, member_id, expires = row[:6]
    member_name, member_rank, member_rank_color = row[6], row[7], row[8]
    discord_id, discord_name, discord_avatar, is_admin = row[9], row[10], row[11], row[12]

    if expires and datetime.now() > expires:
        cur.close()
        db.close()
        return {'statusCode': 401, 'headers': CORS, 'body': {'error': 'session expired'}}

    warnings = []
    if member_id:
        cur.execute(
            "SELECT id, reason, issued_by, created_at FROM warnings WHERE member_id = %s ORDER BY created_at DESC",
            (member_id,),
        )
        for w in cur.fetchall():
            warnings.append({
                'id': w[0],
                'reason': w[1],
                'issued_by': w[2],
                'created_at': w[3].strftime('%d.%m.%Y') if w[3] else '',
            })

    cur.close()
    db.close()

    return {
        'statusCode': 200,
        'headers': CORS,
        'body': {
            'user': {
                'id': user_id,
                'vk_id': vk_id,
                'vk_name': vk_name,
                'vk_photo': vk_photo,
                'member_id': member_id,
                'member_name': member_name,
                'member_rank': member_rank,
                'member_rank_color': member_rank_color,
            },
            'warnings': warnings,
            'is_admin': bool(is_admin),
        },
    }