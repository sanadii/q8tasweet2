# models_helpers.py
from django.conf import settings
from django.db import models
from django.utils import timezone

# TODO: make sure dictionaries are all changed to id and name and any otherthing if needed


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
        
class RoleOptions(models.IntegerChoices):
    PARTY = 1, 'قائمة'
    CANDIDATE = 2, 'مرشح'
    SUPERVISOR = 3, 'مشرف'
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

User = settings.AUTH_USER_MODEL

class TrackModel(models.Model):
    """
    TrackModel is an abstract base class that provides a comprehensive set of fields and methods to track the creation,
    update, and deletion of model instances. It is designed to be inherited by other Django models to easily implement
    and standardize these tracking features across different parts of the application.
    """

    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='%(class)s_created',
        verbose_name='Created by',
        help_text='The user who created this object.'
    )
    
    updated_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='%(class)s_updated'
        verbose_name='Updated by',
        help_text='The user who updated this object.'

    )
    
    deleted_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        blank=True,
        default=False,
        related_name='%(class)s_deleted'
        verbose_name='Deleted by',
        help_text='The user who deleted this object.'

    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    deleted = models.BooleanField(blank=True, default=False)

    class Meta:
        abstract = True
        ordering = ['-created_at']
        # default_permissions = ()

    # to check if the current user has permission to edit the object.
    def is_editable(self, request):
        """
        Determines if the current user has permission to edit the instance.
        It returns True if the user is a superuser or if they are the creator of the instance.
        """
        return request.user.is_superuser or (self.created_by and request.user == self.created_by)

    def save(self, *args, **kwargs):
        """
        Overrides the default save method to update the 'updated_at' field when an instance is updated
        and to set the 'deleted' flag to False when an instance is created.
        """
        if not self.id:
            self.deleted = False
        else:
            self.updated_at = timezone.now()
        super().save(*args, **kwargs)


    def delete(self, *args, **kwargs):
        """
        Marks the instance as deleted by setting the 'deleted' flag to True, updating the 'deleted_at' timestamp,
        and setting the 'deleted_by' field to the current user.
        """
        self.deleted = True
        self.deleted_at = timezone.now()
        self.deleted_by = self.get_current_user()  # Implement this method to get the current user
        self.save()

    def restore(self, *args, **kwargs):
        """
        Reverts the deletion of an instance by resetting the 'deleted' flag, 'deleted_at' timestamp, and 'deleted_by' field.
        """
        self.deleted = False
        self.deleted_at = None
        self.deleted_by = None
        self.save()

class TaskModel(models.Model):
    status = models.IntegerField(choices=StatusOptions.choices, blank=True, null=True)
    priority = models.IntegerField(choices=PriorityOptions.choices, blank=True, null=True)
    moderators = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        abstract = True
