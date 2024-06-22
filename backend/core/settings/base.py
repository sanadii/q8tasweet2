# core/settings/base.py

import os
import dotenv
from pathlib import Path
from datetime import timedelta

# Load environment variables from .env file
dotenv.load_dotenv()

# Determine if the application is running in production mode
PRODUCTION_MODE = os.getenv("MODE") == "production"

# Load production or development settings
if PRODUCTION_MODE:
    from .prod import *
else:
    from dotenv import load_dotenv
    load_dotenv()
    from .dev import *

# Database settings
DB_NAME = os.environ.get("DB_NAME")
DB_USER = os.environ.get("DB_USER")
DB_PASSWORD = os.environ.get("DB_PASSWORD")
DB_HOST = os.environ.get("DB_HOST")
DB_PORT = os.environ.get("DB_PORT")

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# SECURITY WARNING: Secret keys are kept outside in a .env file!
SECRET_KEY = os.environ.get("SECRET_KEY")
JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY")

# Database configuration
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": DB_NAME,
        "USER": DB_USER,
        "PASSWORD": DB_PASSWORD,
        "HOST": DB_HOST,
        "PORT": DB_PORT,
    },
}

# Debug mode
DEBUG = True

# Allowed hosts
ALLOWED_HOSTS = [
    "www.q8tasweet.com",
    "q8tasweet.com",
    "139.59.86.129",
    "127.0.0.1",
    "localhost",
    "localhost:3000",
    "127.0.0.1:8001",
    "*",
]

# Channel layers configuration
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer",
    }
}

# Installed applications
INSTALLED_APPS = [
    "daphne",
    "rest_framework",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework_simplejwt.token_blacklist",
    "corsheaders",
    "django_extensions",
    "core",
    
    # WebSocket and related apps
    "webSocket",
    "apps.notifications",
    
    # Q8Tasweet Apps
    "apps.auths",
    "apps.settings",
    "apps.tags",
    "apps.elections",
    "apps.candidates",
    "apps.campaigns",
    "apps.schemas",
]

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Middleware configuration
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# URL configuration
ROOT_URLCONF = 'core.urls'
CSRF_TRUSTED_ORIGINS = ["http://localhost:3000"]
CORS_ALLOW_CREDENTIALS = True

FRONTEND = os.path.join(BASE_DIR, "../frontend/build")
print("BASE_DIR: ", BASE_DIR)


# Template configuration
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [
            os.path.join(BASE_DIR, "../frontend/build"),
            os.path.join(BASE_DIR, "templates"),
        ],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# Application configuration
ASGI_APPLICATION = "core.asgi.application"

# Password validators
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# REST framework configuration
REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.TokenAuthentication",
    ],
    "DEFAULT_RENDERER_CLASSES": [
        "djangorestframework_camel_case.render.CamelCaseJSONRenderer",
    ],
    "DEFAULT_PARSER_CLASSES": (
        "djangorestframework_camel_case.parser.CamelCaseJSONParser",
    ),
    "DEFAULT_SCHEMA_CLASS": "rest_framework.schemas.coreapi.AutoSchema",
}

# CORS settings
CORS_ALLOWED_ORIGINS = [
    "http://q8election.com",
    "http://localhost:8000",
    "http://localhost:3000",
    "http://127.0.0.1:8000",
    "http://127.0.0.1:3000",
    "http://127.0.0.2:3000",
    "http://localhost:3000",
    "http://localhost:3001",
]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = True
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_SAMESITE = "Lax"

# Custom user model
AUTH_USER_MODEL = "auths.User"

# JWT configuration
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=60),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
    "VERIFYING_KEY": None,
    "AUTH_HEADER_TYPES": (
        "Bearer",
        "JWT",
    ),
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "group_id",
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
    "TOKEN_TYPE_CLAIM": "token_type",
}

# Internationalization
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Kuwait"
USE_I18N = True
USE_L10N = True
USE_TZ = True

# Static files configuration
MEDIA_ROOT = os.path.join(BASE_DIR, "media")
MEDIA_URL = "/media/"
STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, "static")
STATICFILES_DIRS = [os.path.join("../frontend/build/static")]

# Email configuration
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = "shankar.wxit@gmail.com"
EMAIL_HOST_PASSWORD = "mehynnlprcmqilwn"
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"

<<<<<<< HEAD
=======
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': '/debug.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}

import os
print("SECRET_KEY:", os.environ.get("SECRET_KEY"))
print("DB_NAME:", os.environ.get("DB_NAME"))
print("DB_USER:", os.environ.get("DB_USER"))
print("DB_PASSWORD:", os.environ.get("DB_PASSWORD"))
print("DB_HOST:", os.environ.get("DB_HOST"))
print("DB_PORT:", os.environ.get("DB_PORT"))
