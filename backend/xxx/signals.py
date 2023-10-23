from django.db.models.signals import post_migrate
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

@receiver(post_migrate)
def handle_permissions(sender, **kwargs):
    # Remove unwanted permissions
    models_to_clean = ['contenttype', 'session', 'logentry', 'migration', 'group', 'permission', 'blacklistedtoken', 'outstandingtoken']
    content_types = ContentType.objects.filter(model__in=models_to_clean)
    Permission.objects.filter(content_type__in=content_types).delete()
    
    # Add custom permissions for the Group model
    content_type = ContentType.objects.get_for_model(Group)
    for codename, name in generate_custom_permissions():
        Permission.objects.get_or_create(codename=codename, name=name, content_type=content_type)
