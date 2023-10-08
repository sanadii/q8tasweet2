from django.apps import AppConfig

class RestapiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'restapi'

    # def ready(self):
    #     from .models import Elections
    #     Elections.create_custom_permissions()
