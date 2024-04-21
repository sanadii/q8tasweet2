import os
from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from webSocket.channel_middleware import JWTWebsocketMiddleware

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

django_asgi_app = get_asgi_application()

from webSocket import routing

application = ProtocolTypeRouter({
    'http': django_asgi_app,
    'websocket': JWTWebsocketMiddleware(AuthMiddlewareStack(URLRouter(routing.websocket_urlpatterns))),
})