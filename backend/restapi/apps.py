from django.apps import AppConfig
from django.db.models import AutoField

class RestapiConfig(AppConfig):
    default_auto_field = AutoField
    name = 'restapi'
