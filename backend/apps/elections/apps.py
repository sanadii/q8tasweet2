from django.apps import AppConfig

class ElectionConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.elections'


    # Django needs to know about the signals
    def ready(self):
        import apps.elections.signals

