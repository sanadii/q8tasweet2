from django.apps import AppConfig
from django.db.models.signals import post_migrate

class RestapiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'restapi'

    def ready(self):
        # Dynamic import to avoid AppRegistryNotReady
        from . import signals  # this imports signals module which should register the signal handlers

        # Connect the remove_unwanted_permissions function to post_migrate signal
        post_migrate.connect(signals.remove_unwanted_permissions, sender=self)
