"""VK OAuth авторизация: обмен кода на токен, создание сессии."""
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

    app_id = os.environ['VK_APP_ID']
    app_secret = os.environ['VK_APP_SECRET']

    params = urllib.parse.urlencode({
        'client_id': app_id,
        'client_secret': app_secret,
        'redirect_uri': redirect_uri,
        'code': code,
    })
    url = f'https://oauth.vk.com/access_token?{params}'
    with urllib.request.urlopen(url, timeout=10) as resp:
        vk_data = json.loads(resp.read())

    if 'error' in vk_data:
        return {'statusCode': 401, 'headers': CORS, 'body': {'error': vk_data.get('error_description', 'vk error')}}

    vk_id = vk_data['user_id']
    access_token = vk_data['access_token']

    user_params = urllib.parse.urlencode({
        'user_ids': vk_id,
        'fields': 'photo_100',
        'access_token': access_token,
        'v': '5.199',
    })
    user_url = f'https://api.vk.com/method/users.get?{user_params}'
    with urllib.request.urlopen(user_url, timeout=10) as resp:
        user_resp = json.loads(resp.read())

    vk_user = user_resp.get('response', [{}])[0]
    vk_name = f"{vk_user.get('first_name', '')} {vk_user.get('last_name', '')}".strip()
    vk_photo = vk_user.get('photo_100', '')

    session_token = secrets.token_hex(32)
    expires = datetime.now() + timedelta(days=30)

    db = conn()
    cur = db.cursor()
    cur.execute(
        """
        INSERT INTO users (vk_id, vk_name, vk_photo, session_token, session_expires)
        VALUES (%s, %s, %s, %s, %s)
        ON CONFLICT (vk_id) DO UPDATE
          SET vk_name = EXCLUDED.vk_name,
              vk_photo = EXCLUDED.vk_photo,
              session_token = EXCLUDED.session_token,
              session_expires = EXCLUDED.session_expires
        RETURNING id, member_id
        """,
        (vk_id, vk_name, vk_photo, session_token, expires),
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
            'vk_name': vk_name,
            'vk_photo': vk_photo,
            'member_id': member_id,
        },
    }
