from django.apps import AppConfig
from django.db.models import AutoField

class RestapiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'restapi'
