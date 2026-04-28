"""Админ-панель Family Ross: авторизация, управление участниками и выговорами."""
import json
import os
import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
}

ADMIN_TOKEN = "admin-ross-session"


def db():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def ok(data):
    return {'statusCode': 200, 'headers': CORS, 'body': data}


def err(msg, code=400):
    return {'statusCode': code, 'headers': CORS, 'body': {'error': msg}}


def check_auth(headers):
    token = (headers or {}).get('X-Admin-Token') or (headers or {}).get('x-admin-token', '')
    return token == ADMIN_TOKEN


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    path = event.get('path', '/')
    headers = event.get('headers') or {}
    body = {}
    if event.get('body'):
        raw = event['body']
        body = json.loads(raw) if isinstance(raw, str) else raw

    # LOGIN
    if path.endswith('/login'):
        password = body.get('password', '')
        if password == os.environ.get('ADMIN_PASSWORD', ''):
            return ok({'token': ADMIN_TOKEN})
        return err('Неверный пароль', 401)

    if not check_auth(headers):
        return err('unauthorized', 401)

    # GET /members
    if method == 'GET' and path.endswith('/members'):
        conn = db()
        cur = conn.cursor()
        cur.execute("""
            SELECT m.id, m.name, m.rank, m.rank_color, m.joined_at, m.note,
                   u.id as user_id, u.vk_id, u.vk_name, u.vk_photo,
                   (SELECT COUNT(*) FROM warnings w WHERE w.member_id = m.id AND w.active = TRUE) as warn_count
            FROM members m
            LEFT JOIN users u ON u.member_id = m.id
            ORDER BY m.id ASC
        """)
        rows = cur.fetchall()
        cur.close(); conn.close()
        members = [{
            'id': r[0], 'name': r[1], 'rank': r[2], 'rank_color': r[3],
            'joined_at': r[4].strftime('%d.%m.%Y') if r[4] else '',
            'note': r[5] or '',
            'user_id': r[6], 'vk_id': r[7], 'vk_name': r[8], 'vk_photo': r[9],
            'warn_count': r[10],
        } for r in rows]
        return ok({'members': members})

    # POST /members
    if method == 'POST' and path.endswith('/members'):
        name = body.get('name', '').strip()
        rank = body.get('rank', '').strip()
        rank_color = body.get('rank_color', 'text-gray-400')
        note = body.get('note', '')
        if not name or not rank:
            return err('name и rank обязательны')
        conn = db()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO members (name, rank, rank_color, note) VALUES (%s,%s,%s,%s) RETURNING id",
            (name, rank, rank_color, note)
        )
        new_id = cur.fetchone()[0]
        conn.commit(); cur.close(); conn.close()
        return ok({'id': new_id, 'name': name, 'rank': rank, 'rank_color': rank_color})

    # PUT /members/<id>
    if method == 'PUT' and '/members/' in path:
        member_id = int(path.split('/members/')[-1])
        name = body.get('name', '').strip()
        rank = body.get('rank', '').strip()
        rank_color = body.get('rank_color', 'text-gray-400')
        note = body.get('note', '')
        if not name or not rank:
            return err('name и rank обязательны')
        conn = db()
        cur = conn.cursor()
        cur.execute(
            "UPDATE members SET name=%s, rank=%s, rank_color=%s, note=%s WHERE id=%s",
            (name, rank, rank_color, note, member_id)
        )
        conn.commit(); cur.close(); conn.close()
        return ok({'ok': True})

    # GET /users
    if method == 'GET' and path.endswith('/users'):
        conn = db()
        cur = conn.cursor()
        cur.execute("""
            SELECT u.id, u.vk_id, u.vk_name, u.vk_photo, u.member_id, m.name
            FROM users u
            LEFT JOIN members m ON m.id = u.member_id
            ORDER BY u.id DESC
        """)
        rows = cur.fetchall()
        cur.close(); conn.close()
        users = [{'id': r[0], 'vk_id': r[1], 'vk_name': r[2], 'vk_photo': r[3],
                  'member_id': r[4], 'member_name': r[5]} for r in rows]
        return ok({'users': users})

    # POST /link
    if method == 'POST' and path.endswith('/link'):
        user_id = body.get('user_id')
        member_id = body.get('member_id')
        conn = db()
        cur = conn.cursor()
        cur.execute("UPDATE users SET member_id=%s WHERE id=%s", (member_id, user_id))
        conn.commit(); cur.close(); conn.close()
        return ok({'ok': True})

    # GET /warnings
    if method == 'GET' and path.endswith('/warnings'):
        conn = db()
        cur = conn.cursor()
        cur.execute("""
            SELECT w.id, w.member_id, m.name, w.reason, w.issued_by, w.created_at
            FROM warnings w
            JOIN members m ON m.id = w.member_id
            WHERE w.active = TRUE
            ORDER BY w.created_at DESC
        """)
        rows = cur.fetchall()
        cur.close(); conn.close()
        warnings = [{'id': r[0], 'member_id': r[1], 'member_name': r[2],
                     'reason': r[3], 'issued_by': r[4],
                     'created_at': r[5].strftime('%d.%m.%Y') if r[5] else ''} for r in rows]
        return ok({'warnings': warnings})

    # POST /warnings
    if method == 'POST' and path.endswith('/warnings'):
        member_id = body.get('member_id')
        reason = body.get('reason', '').strip()
        issued_by = body.get('issued_by', '').strip()
        if not member_id or not reason:
            return err('member_id и reason обязательны')
        conn = db()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO warnings (member_id, reason, issued_by) VALUES (%s,%s,%s) RETURNING id",
            (member_id, reason, issued_by)
        )
        new_id = cur.fetchone()[0]
        conn.commit(); cur.close(); conn.close()
        return ok({'id': new_id})

    # POST /warnings/remove/<id>
    if method == 'POST' and '/warnings/remove/' in path:
        warn_id = int(path.split('/warnings/remove/')[-1])
        conn = db()
        cur = conn.cursor()
        cur.execute("UPDATE warnings SET active = FALSE WHERE id = %s", (warn_id,))
        conn.commit(); cur.close(); conn.close()
        return ok({'ok': True})

    return err('not found', 404)
