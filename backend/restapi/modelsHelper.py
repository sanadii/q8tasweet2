# model_helpers.py
from django.db import models


class ElectionType(models.TextChoices):
    PARTIES = 1, "قوائم"
    CANDIDATES = 2, "مرشحين"
    MIXED = 3, "قوائم ومرشحين"

class ElectionResults(models.TextChoices):
    FINAL = 1, "نتائج نهائية"
    DETAILED = 2, "نتائج تفصيلية"


class Gender(models.IntegerChoices):
    UNDEFINED = 0, 'Undefined'
    MALE = 1, 'رجال'
    FEMALE = 2, 'نساء'

class GenderCommittee(models.IntegerChoices):
    UNDEFINED = 0, 'Undefined'
    MALE = 1, 'ذكور'
    FEMALE = 2, 'إناث'

class GuaranteeStatus(models.IntegerChoices):
    NEW = 1, 'New'
    CONTACTED = 2, 'Contacted'
    CONFIRMED = 3, 'Confirmed'
    NOT_CONFIRMED = 4, 'Not Confirmed'
        
class Rank(models.TextChoices):
    PARTY = 1, 'Party'
    CANDIDATE = 2, 'Candidate'
    SUPERVISOR = 3, 'Supervisor'
    GUARANTOR = 4, 'Guarantor'
    ATTENDANT = 5, 'Attendant'
    SORTER = 6, 'Sorter'
    # OTHER = 7, 'Other'  # Commented out as per your code.
    MODERATOR = 10, 'Moderator'
