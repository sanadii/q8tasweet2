# configs/models.py
from django.conf import settings
from django.db import models
from django.utils import timezone

from utils.html import TagCloser
from utils.models import base_concrete_model, get_user_model_name, get_current_user


# Governates
class Governorate(models.Model):
    AHMADI = "ahmadi"
    CAPITAL = "capital"
    FARWANIYA = "farwaniya"
    HAWALLY = "hawally"
    JAHRA = "jahra"
    MUBARAK = "mubarak"

    GOVERNORATE_CHOICES = [
        (AHMADI, "الأحمدي"),
        (CAPITAL, "العاصمة"),
        (FARWANIYA, "الفروانية"),
        (HAWALLY, "حولي"),
        (JAHRA, "الجهراء"),
        (MUBARAK, "مبارك الكبير"),
    ]

    name = models.CharField(
        max_length=10,
        choices=GOVERNORATE_CHOICES,
        default=AHMADI,
    )

    # Rest of your model fields...


# Areas
class Area(models.Model):
    name = models.CharField(max_length=10,choices=GOVERNORATE_CHOICES,default=AHMADI)
    governate = models.CharField(max_length=10,choices=GOVERNORATE_CHOICES,default=AHMADI)
