import os
import django
import random

# Set the Django settings module
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from restapi.models import Candidates

candidates = Candidates.objects.all()

# Iterate through the candidates and update the image field
for candidate in candidates:
    # Determine the avatar range based on the candidate's gender
    if candidate.gender == 1:
        # Select a random avatar between 11 and 14
        avatar_number = random.randint(11, 14)
    elif candidate.gender == 2:
        # Select a random avatar between 21 and 26
        avatar_number = random.randint(21, 26)
    else:
        # Optionally, handle other gender values if necessary
        continue

    avatar_path = f'users/avatar-{avatar_number}.jpg'

    # Update the image field
    candidate.image = avatar_path
    candidate.save()
