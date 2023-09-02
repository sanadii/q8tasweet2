import os
import django

# Set the Django settings module
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")  # Ensure this is the correct path
django.setup()

from restapi.models import Electors  # Import Electors model

def convert_gender(elector):
    """Convert gender strings to integers: 'm' -> 1, 'f' -> 2, else -> 0"""
    if elector.gender == 'm':
        return 1
    elif elector.gender == 'f':
        return 2
    else:
        return 0

def fix_gender_data():
    # Fetch all Electors
    all_electors = Electors.objects.all()  # Use Electors instead of elector
    
    # Update gender for each Elector
    for elector in all_electors:
        elector.gender = convert_gender(elector)
        elector.save()

# Execute the function
fix_gender_data()

print("Gender data updated!")
