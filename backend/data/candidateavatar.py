import os
import django

# Set the Django settings module
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from restapi.models import Candidates

def update_candidates_images():
    # Fetch all candidate instances
    candidates = Candidates.objects.all()

    # Define your image links
    images = [f'media/users/avatar-{i}.jpg' for i in range(1, 11)]

    for i, candidate in enumerate(candidates):
        # Assign an image link to each candidate
        candidate.image = images[i % len(images)]
        candidate.save()

# Call the function to update candidate images
update_candidates_images()
