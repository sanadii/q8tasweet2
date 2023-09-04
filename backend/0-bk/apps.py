from django.apps import AppConfig
from django.db.models import BigAutoField

class RestapiConfig(AppConfig):
    default_auto_field = BigAutoField
    name = 'elections'
