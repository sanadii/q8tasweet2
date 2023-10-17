from django.db.models.signals import post_save, post_migrate
from django.dispatch import receiver
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType

def generate_custom_permissions():
    """Generate custom permissions for the Group model."""
    return [
        ("canViewGroup", "Can View Group"),
        ("canAddGroup", "Can Add Group"),
        ("canChangeGroup", "Can Change Group"),
        ("canDeleteGroup", "Can Delete Group"),
    ]

@receiver(post_save, sender=Group)
def assign_custom_permissions(sender, instance, created, **kwargs):
    if not created:
        # Skip if the group is not being created for the first time
        return

    # Remove all default permissions
    instance.permissions.clear()

    # Get content type for the Group model
    content_type = ContentType.objects.get_for_model(Group)

    # Create and assign custom permissions
    for codename, name in generate_custom_permissions():
        permission, _ = Permission.objects.get_or_create(
            codename=codename,
            name=name,
            content_type=content_type,
        )
        instance.permissions.add(permission)

@receiver(post_migrate)
def remove_unwanted_permissions(sender, **kwargs):
    models_to_clean = ['contenttype', 'session', 'logentry', 'migration']
    content_types = ContentType.objects.filter(model__in=models_to_clean)
    Permission.objects.filter(content_type__in=content_types).delete()
