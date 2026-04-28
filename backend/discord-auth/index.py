"""Discord OAuth авторизация: обмен кода на токен, создание сессии."""
import json
import os
import secrets
import urllib.request
import urllib.parse
import psycopg2
from datetime import datetime, timedelta

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}


def conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    code = body.get('code', '').strip()
    redirect_uri = body.get('redirect_uri', '').strip()

    if not code or not redirect_uri:
        return {'statusCode': 400, 'headers': CORS, 'body': {'error': 'code and redirect_uri required'}}

    client_id = os.environ['DISCORD_CLIENT_ID']
    client_secret = os.environ['DISCORD_CLIENT_SECRET']

    # Обмен кода на токен
    token_data = urllib.parse.urlencode({
        'client_id': client_id,
        'client_secret': client_secret,
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': redirect_uri,
    }).encode()

    req = urllib.request.Request(
        'https://discord.com/api/oauth2/token',
        data=token_data,
        headers={'Content-Type': 'application/x-www-form-urlencoded'},
        method='POST',
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        token_resp = json.loads(resp.read())

    if 'error' in token_resp:
        return {'statusCode': 401, 'headers': CORS, 'body': {'error': token_resp.get('error_description', 'discord error')}}

    access_token = token_resp['access_token']

    # Получаем данные пользователя
    user_req = urllib.request.Request(
        'https://discord.com/api/users/@me',
        headers={'Authorization': f'Bearer {access_token}'},
    )
    with urllib.request.urlopen(user_req, timeout=10) as resp:
        discord_user = json.loads(resp.read())

    discord_id = str(discord_user['id'])
    discord_name = discord_user.get('global_name') or discord_user.get('username', '')
    avatar_hash = discord_user.get('avatar')
    discord_avatar = f"https://cdn.discordapp.com/avatars/{discord_id}/{avatar_hash}.png" if avatar_hash else ''

    session_token = secrets.token_hex(32)
    expires = datetime.now() + timedelta(days=30)

    db = conn()
    cur = db.cursor()

    # Проверяем — есть ли уже юзер с таким discord_id
    cur.execute("SELECT id FROM users WHERE discord_id = %s", (discord_id,))
    existing = cur.fetchone()

    if existing:
        cur.execute(
            """UPDATE users SET discord_name=%s, discord_avatar=%s, session_token=%s, session_expires=%s
               WHERE discord_id=%s RETURNING id, member_id""",
            (discord_name, discord_avatar, session_token, expires, discord_id)
        )
    else:
        cur.execute(
            """INSERT INTO users (discord_id, discord_name, discord_avatar, session_token, session_expires)
               VALUES (%s, %s, %s, %s, %s)
               RETURNING id, member_id""",
            (discord_id, discord_name, discord_avatar, session_token, expires)
        )

    row = cur.fetchone()
    user_id, member_id = row[0], row[1]
    db.commit()
    cur.close()
    db.close()

    return {
        'statusCode': 200,
        'headers': CORS,
        'body': {
            'session_token': session_token,
            'user_id': user_id,
            'discord_name': discord_name,
            'discord_avatar': discord_avatar,
            'member_id': member_id,
        },
    }