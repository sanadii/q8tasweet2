# modelsHelpers.py
from django.db import models
from django.core.validators import RegexValidator

class TrackedModel(models.Model):
    created_by = models.ForeignKey('restapi.user', on_delete=models.SET_NULL, null=True, blank=True, related_name='%(class)s_created')
    updated_by = models.ForeignKey('restapi.user', on_delete=models.SET_NULL, null=True, blank=True, related_name='%(class)s_updated')
    deleted_by = models.ForeignKey('restapi.user', on_delete=models.SET_NULL, null=True, blank=True, related_name='%(class)s_deleted')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    deleted = models.BooleanField(default=False)

    class Meta:
        abstract = True

class StatusOptions(models.IntegerChoices):
    PUBLISHED = 1, 'منشور'
    PRIVATE = 2, 'خاص'
    PENDING_APPROVAL = 3, 'في أنتظار الموافقة'
    MISSING_DATA = 4, 'يفتقد للبيانات'
    IN_PROGRESS = 5, 'جاري العمل عليه'
    NEW = 6, 'جديد'
    DELETED = 9, 'محذوف'

class PriorityOptions(models.IntegerChoices):
    HIGH = 3, 'عالي'
    MEDIUM = 2, 'متوسط'
    LOW = 1, 'منخفض'

class ElectionTypeOptions(models.IntegerChoices):
    PARTIES = 1, "قوائم"
    CANDIDATES = 2, "مرشحين"
    MIXED = 3, "قوائم ومرشحين"

class ElectionResultsOptions(models.IntegerChoices):
    FINAL = 1, "نتائج نهائية"
    DETAILED = 2, "نتائج تفصيلية"


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
        
class RankOptions(models.IntegerChoices):
    PARTY = 1, 'قائمة'
    CANDIDATE = 2, 'مرشح'
    SUPERVISOR = 3, 'مشرف'
    GUARANTOR = 4, 'ضامن'
    ATTENDANT = 5, 'محضر'
    SORTER = 6, 'فارز'
    # OTHER = 7, 'Other'  # Commented out as per your code.
    MODERATOR = 10, 'مدير'

