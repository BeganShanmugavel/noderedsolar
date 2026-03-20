import os
from functools import wraps
from datetime import datetime, timedelta

import jwt
from flask import request, jsonify, g
from werkzeug.security import generate_password_hash, check_password_hash

JWT_SECRET = os.getenv('JWT_SECRET', 'solar-secret')
JWT_ALGO = 'HS256'
JWT_EXP_HOURS = int(os.getenv('JWT_EXP_HOURS', '12'))


def hash_password(password: str) -> str:
    return generate_password_hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return check_password_hash(password_hash, password)


def generate_token(user: dict) -> str:
    payload = {
        'sub': user['id'],
        'email': user['email'],
        'role': user['role'],
        'exp': datetime.utcnow() + timedelta(hours=JWT_EXP_HOURS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)


def decode_token(token: str):
    return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])


def token_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Missing or invalid token'}), 401
        token = auth_header.split(' ', 1)[1]
        try:
            claims = decode_token(token)
            g.user = claims
        except Exception:
            return jsonify({'error': 'Invalid or expired token'}), 401
        return func(*args, **kwargs)

    return wrapper


def admin_required(func):
    @wraps(func)
    @token_required
    def wrapper(*args, **kwargs):
        if g.user.get('role') != 'admin':
            return jsonify({'error': 'Admin role required'}), 403
        return func(*args, **kwargs)

    return wrapper
