import os
import django
import random
import datetime
from django.db import models
from django.utils import timezone

# Set the Django settings module
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from users.models import User

def create_random_users():
    for i in range(20):
        email = f"user{i}@example.com"
        username = f"user{i}"
        first_name = f"Firstname{i}"
        last_name = f"Lastname{i}"
        start_date = timezone.now()
        about = f"This is user{i}."
        is_staff = random.choice([True, False])
        is_active = random.choice([True, False])
        is_candidate = random.choice([True, False])
        civil_id = str(random.randint(100000000000, 999999999999))
        date_of_birth = datetime.date(2000, 1, 1)
        phone_number = str(random.randint(1000000000, 9999999999))
        address = f"Address{i}"
        gender = random.choice(['Male', 'Female'])
        education_level = random.choice(['High School', 'Bachelor', 'Master', 'PhD'])

        User.objects.create_user(
            email=email,
            username=username,
            first_name=first_name,
            last_name=last_name,
            start_date=start_date,
            about=about,
            is_staff=is_staff,
            is_active=is_active,
            is_candidate=is_candidate,
            civil_id=civil_id,
            date_of_birth=date_of_birth,
            phone_number=phone_number,
            address=address,
            gender=gender,
            education_level=education_level,
            password='password123'  # Don't use this password in production
        )

if __name__ == "__main__":
    create_random_users()
