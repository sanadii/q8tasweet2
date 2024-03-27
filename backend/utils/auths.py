import random
from apps.auths.models import User

def generate_username(email):
    base_username = email.split('@')[0]
    username = base_username
    while User.objects.filter(username=username).exists():
        random_number = random.randint(1, 99)  # Generates a number between 1 and 99
        username = f"{base_username}{random_number}"
    return username
