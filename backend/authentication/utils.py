# utils/token_utils.py
import jwt
from django.conf import settings
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
import hashlib


def get_user_from_token(request):
    auth = request.headers.get("Authorization", "")
    if auth.startswith("Bearer "):
        token = auth.split(" ")[1]
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            return payload
        except ExpiredSignatureError:
            return None
        except InvalidTokenError:
            return None
    return None


SALT = 'abc'
def hash_password(password: str) -> str:
    return hashlib.sha256((SALT + password).encode()).hexdigest()