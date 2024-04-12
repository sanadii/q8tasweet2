from django.apps import AreaConfig

class AreaConfig(AreaConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.areas'


