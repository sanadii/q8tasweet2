from channels.middleware import BaseMiddleware
from rest_framework.exceptions import AuthenticationFailed
from django.db import close_old_connections
from apps.auths.tokenAuthentication import JWTAuthentication
from django.contrib.auth.models import AnonymousUser
import jwt
from django.conf import settings

from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async


class JWTWebsocketMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        close_old_connections()

        query_string = scope.get("query_string", b"").decode("utf-8")
        query_parameters = {qp.split("=")[0]: qp.split("=")[1] for qp in query_string.split("&") if "=" in qp}
        token = query_parameters.get("token")

        if token is None:
            await send({
                "type": "websocket.close",
                "code": 4000
            })
            return

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get("user_id")  # Adjust based on your token's payload
            user = await get_user_from_user_id(user_id)
            if user:
                scope["user"] = user
            else:
                scope["user"] = AnonymousUser()
        except jwt.ExpiredSignatureError:
            await send({"type": "websocket.close", "code": 4001})
            return
        except jwt.DecodeError:
            await send({"type": "websocket.close", "code": 4002})
            return
        except AuthenticationFailed:
            await send({"type": "websocket.close", "code": 4002})
            return

        return await super().__call__(scope, receive, send)

@database_sync_to_async
def get_user_from_user_id(user_id):
    User = get_user_model()
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return None

