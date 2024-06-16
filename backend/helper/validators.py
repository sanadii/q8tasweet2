from django.core.validators import RegexValidator
from datetime import date

def today():
    return date.today()

civil_validator = RegexValidator(regex=r'^\d{12}$', message="Civil must be exactly 12 digits.")
phone_validator = RegexValidator(regex=r'^\d{8}$', message="phone must be exactly 8 digits.")
