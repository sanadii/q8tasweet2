
import os
from django.conf import settings
from django.db import connections
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.elections.models import Election

def setup_election_database_connection(slug):
    db_path = os.path.join(settings.BASE_DIR, "database", f"{slug}.sqlite3")
    db_alias = f"election_{slug}"

    settings.DATABASES[db_alias] = {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": db_path,
        "ATOMIC_REQUESTS": True,
        "TIME_ZONE": "Asia/Kuwait",
        "CONN_HEALTH_CHECKS": True,
        "CONN_MAX_AGE": 600,
        "OPTIONS": {},
        "AUTOCOMMIT": True,
    }

    return connections[db_alias]
