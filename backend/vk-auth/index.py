"""VK авторизация: поддерживает VK ID SDK (code+device_id) и стандартный OAuth (code+redirect_uri)."""
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


def save_user(vk_id, vk_name, vk_photo):
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
    return session_token, user_id, member_id


def get_vk_user_info(access_token, vk_id=None):
    params = urllib.parse.urlencode({
        'fields': 'photo_100',
        'access_token': access_token,
        'v': '5.199',
        **(({'user_ids': vk_id}) if vk_id else {}),
    })
    url = f'https://api.vk.com/method/users.get?{params}'
    with urllib.request.urlopen(url, timeout=10) as resp:
        data = json.loads(resp.read())
    user = data.get('response', [{}])[0]
    return user


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    code = body.get('code', '').strip()
    device_id = body.get('device_id', '').strip()
    redirect_uri = body.get('redirect_uri', '').strip()

    if not code:
        return {'statusCode': 400, 'headers': CORS, 'body': {'error': 'code required'}}

    app_id = os.environ['VK_APP_ID']
    app_secret = os.environ['VK_APP_SECRET']

    # ── VK ID SDK (новый способ: code + device_id) ────────────────────────
    if device_id:
        base_redirect = 'https://preview--family-ross-site.poehali.dev/cabinet'
        params = urllib.parse.urlencode({
            'code': code,
            'device_id': device_id,
            'client_id': app_id,
            'client_secret': app_secret,
            'grant_type': 'authorization_code',
            'redirect_uri': base_redirect,
        })
        req = urllib.request.Request(
            'https://id.vk.com/oauth2/auth',
            data=params.encode(),
            headers={'Content-Type': 'application/x-www-form-urlencoded'},
            method='POST',
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            token_data = json.loads(resp.read())

        if 'error' in token_data:
            return {'statusCode': 401, 'headers': CORS, 'body': {'error': token_data.get('error_description', 'vk id error')}}

        access_token = token_data.get('access_token', '')
        vk_id = token_data.get('user_id') or token_data.get('sub')
        user = get_vk_user_info(access_token, vk_id)

    # ── Стандартный OAuth (code + redirect_uri) ───────────────────────────
    elif redirect_uri:
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
        user = get_vk_user_info(access_token, vk_id)

    else:
        return {'statusCode': 400, 'headers': CORS, 'body': {'error': 'device_id or redirect_uri required'}}

    vk_name = f"{user.get('first_name', '')} {user.get('last_name', '')}".strip()
    vk_photo = user.get('photo_100', '')
    vk_id = vk_id or user.get('id')

    session_token, user_id, member_id = save_user(int(vk_id), vk_name, vk_photo)

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