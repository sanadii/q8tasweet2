# models_elpers.py
from django.db import models
from django.utils import timezone

from django.core.validators import RegexValidator

class GroupCategories(models.IntegerChoices):
    ADMIN = 1, 'Admin'
    CONTRIBUTOR = 2, 'Contributor'
    MEMBER = 4, 'Member'
    SUBSCRIBER = 5, 'Subscriber'

group_category_field = models.IntegerField(
    choices=GroupCategories.choices,
    default=GroupCategories.MEMBER,
)

group_permission_field = models.CharField(max_length=255, null=True, blank=True)  # Define your char field with desired attributes

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

class TrackModel(models.Model):
    created_by = models.ForeignKey('restapi.user', on_delete=models.SET_NULL, null=True, blank=True, related_name='%(class)s_created')
    updated_by = models.ForeignKey('restapi.user', on_delete=models.SET_NULL, null=True, blank=True, related_name='%(class)s_updated')
    deleted_by = models.ForeignKey('restapi.user', on_delete=models.SET_NULL, null=True, blank=True, related_name='%(class)s_deleted')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    deleted = models.BooleanField(blank=True, null=True, default=False)

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        # If instance has an ID, it means the instance already exists,
        # hence we can update the `updated_at` field.
        if self.id:
            self.updated_at = timezone.now()
        super(TrackModel, self).save(*args, **kwargs)

class TaskModel(models.Model):
    status = models.IntegerField(choices=StatusOptions.choices, blank=True, null=True)
    priority = models.IntegerField(choices=PriorityOptions.choices, blank=True, null=True)
    moderators = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        abstract = True
