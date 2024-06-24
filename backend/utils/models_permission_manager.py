from django.db import models
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType

class ModelsPermissionManager(models.Manager):
    def get_or_create_custom_permissions(self):
        """
        Create custom permissions for the model based on the model name.
        """
        opts = self.model._meta
        model_name = opts.object_name.lower()  # Get the model name in lowercase
        content_type, _ = ContentType.objects.get_or_create(
            app_label=opts.app_label,
            model=model_name
        )

        # Define custom permissions based on model name and verbose name
        custom_permissions = [
            (f"view_{model_name}", f"Can view {opts.verbose_name}"),
            (f"add_{model_name}", f"Can add {opts.verbose_name}"),
            (f"change_{model_name}", f"Can change {opts.verbose_name}"),
            (f"delete_{model_name}", f"Can delete {opts.verbose_name}"),
        ]

        # Create or update each custom permission
        for codename, name in custom_permissions:
            permission, created = Permission.objects.get_or_create(
                codename=codename,
                content_type=content_type,
                defaults={'name': name}
            )

        return custom_permissions



class CustomPermissionManager(models.Manager):
    def create_permission(self, model_cls, codename, name):
        content_type = ContentType.objects.get_for_model(model_cls)
        permission, created = Permission.objects.get_or_create(
            codename=codename,
            content_type=content_type,
            defaults={'name': name},
        )
        return permission
