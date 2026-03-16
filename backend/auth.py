from functools import wraps
from flask import request, jsonify


def token_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        token = request.headers.get('Authorization', '')
        if not token.startswith('Bearer '):
            return jsonify({'error': 'Missing or invalid token'}), 401
        return func(*args, **kwargs)

    return wrapper
