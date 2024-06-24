# core/settings/prod.py
import os

ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "").split(" ")

DEBUG = False

CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
USE_X_FORWARDED_PORT = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Sentry configuration (uncomment if using Sentry)
# import sentry_sdk
# from sentry_sdk.integrations.django import DjangoIntegration

SENTRY_DNS = os.getenv("SENTRY_DNS")

# sentry_sdk.init(
#     dsn=SENTRY_DNS,
#     integrations=[DjangoIntegration()],
#     send_default_pii=True
# )

# Django CORS Headers
CORS_ORIGIN_WHITELIST = [
    'https://example.com',
    'https://www.example.com',
]

# DRF
REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',
    ),
}

# Memcached and pylibmc
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.memcached.MemcachedCache',
        'LOCATION': '127.0.0.1:11211',
    }
}
