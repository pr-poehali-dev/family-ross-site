"""Управление участниками семьи Ross: получение списка и добавление новых."""
import json
import os
import psycopg2

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    method = event.get('httpMethod', 'GET')

    if method == 'GET':
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("SELECT id, name, rank, rank_color FROM members ORDER BY id ASC")
        rows = cur.fetchall()
        cur.close()
        conn.close()
        members = [
            {'id': r[0], 'name': r[1], 'rank': r[2], 'rank_color': r[3]}
            for r in rows
        ]
        return {
            'statusCode': 200,
            'headers': CORS_HEADERS,
            'body': {'members': members},
        }

    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        name = body.get('name', '').strip()
        rank = body.get('rank', '').strip()
        rank_color = body.get('rank_color', 'text-gray-400').strip()

        if not name or not rank:
            return {
                'statusCode': 400,
                'headers': CORS_HEADERS,
                'body': {'error': 'name and rank are required'},
            }

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO members (name, rank, rank_color) VALUES (%s, %s, %s) RETURNING id",
            (name, rank, rank_color),
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()

        return {
            'statusCode': 201,
            'headers': CORS_HEADERS,
            'body': {'id': new_id, 'name': name, 'rank': rank, 'rank_color': rank_color},
        }

    return {'statusCode': 405, 'headers': CORS_HEADERS, 'body': ''}