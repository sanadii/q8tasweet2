# models_helpers.py
from django.conf import settings
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

# TODO: make sure dictionaries are all changed to id and name and any otherthing if needed

class StatusOptions(models.IntegerChoices):
    PUBLISHED = 1, 'منشور'
    PRIVATE = 2, 'خاص'
    PENDING_APPROVAL = 3, 'في أنتظار الموافقة'
    MISSING_DATA = 4, 'يفتقد للبيانات'
    IN_PROGRESS = 5, 'جاري العمل عليه'
    NEW = 6, 'جديد'
    DEMO = 7, 'تجريبي'
    DELETED = 9, 'محذوف'

class PriorityOptions(models.IntegerChoices):
    LOW = 1, 'منخفض'
    MEDIUM = 2, 'متوسط'
    HIGH = 3, 'عالي'

class ElectionMethodOptions(models.TextChoices):
    CANDIDATE_ONLY_SYSTEM = 'candidateOnly', _('Candidate Only System')
    PARTY_ONLY_SYSTEM = 'partyOnly', _('Party Only System')
    PARTY_CANDIDATE_ONLY_SYSTEM = 'partyCandidateOnly', _('Party Candidate Only System')
    COMBINED_PARTY_CANDIDATE_SYSTEM = 'partyCandidateCombined', _('Combined Party Candidate System')
    PROPORTIONAL_REPRESENTATION_SYSTEM = 'proportionalRepresentationSystem', _('Proportional Representation System')
    MIXED_ELECTORAL_SYSTEM = 'mixedVoteralSystem', _('Mixed Voteral System')

class ElectionResultsOptions(models.TextChoices):
    CANDIDATE_ONLY = 'candidateOnly', _('Candidate Only')
    PARTY_ONLY = 'partyOnly', _('Party Only')
    PARTY_CANDIDATE_COMBINED = 'partyCandidateCombined', _('Party Candidate Combined')
    

class GenderOptions(models.IntegerChoices):
    UNDEFINED = 0, 'Undefined'
    MALE = 1, 'رجال'
    FEMALE = 2, 'نساء'

class GenderCommitteeOptions(models.IntegerChoices):
    UNDEFINED = 0, 'Undefined'
    MALE = 1, 'ذكور'
    FEMALE = 2, 'إناث'

class GuaranteeStatusOptions(models.IntegerChoices):
    NEW = 1, 'جديد'
    CONTACTED = 2, 'تم التواصل'
    CONFIRMED = 3, 'تم التأكيد'
    NOT_CONFIRMED = 4, 'غير مؤكد'
    NOT_KNOWN = 5, 'غير معروف'
        
class RoleOptions(models.IntegerChoices):
    PARTY = 1, 'قائمة'
    CANDIDATE = 2, 'مرشح'
    SUPERVISOR = 3, 'وكيل'
    GUARANTOR = 4, 'ضامن'
    ATTENDANT = 5, 'محضر'
    SORTER = 6, 'فارز'
    # OTHER = 7, 'Other'  # Commented out as per your code.
    MODERATOR = 10, 'مدير'


# def generate_custom_permissions(model_name):
#     """Generate custom permissions for a given model name."""
#     permissions = [
#         ('canView' + model_name, 'Can View ' + model_name),
#         ('canAdd' + model_name, 'Can Add ' + model_name),
#         ('canChange' + model_name, 'Can Change ' + model_name),
#         ('canDelete' + model_name, 'Can Delete ' + model_name),
#     ]
#     return permissions


# class CustomMeta(models.base.ModelBase):
#     def __new__(cls, name, bases, attrs):
#         new_class = super().__new__(cls, name, bases, attrs)
        
#         # If it's not the base model itself and doesn't have abstract attribute
#         if name != "BaseModel" and not new_class._meta.abstract:
#             setattr(new_class.Meta, 'permissions', generate_custom_permissions(name))
        
#         return new_class
