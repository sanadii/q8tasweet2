from slugify import slugify
from django.apps import apps

def generate_slug(value):
    """
    Generate a unique slug for a given value.
    """
    # Slugify the value
    Election = apps.get_model('elections', 'Election')

    slug = slugify(value, separator="-", lowercase=True, max_length=50)

    # Check if the slug already exists in the Election model
    existing_slugs = Election.objects.filter(slug__startswith=slug).values_list('slug', flat=True)

    if slug not in existing_slugs:
        return slug

    # If the slug already exists, append a number to make it unique
    counter = 1
    new_slug = f"{slug}-{counter}"
    while new_slug in existing_slugs:
        counter += 1
        new_slug = f"{slug}-{counter}"

    return new_slug
