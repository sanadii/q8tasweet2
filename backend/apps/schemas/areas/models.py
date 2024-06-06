from django.db import models
from apps.schemas.schemaModels import DynamicSchemaModel

# Governorates with Arabic names
GOVERNORATE_CHOICES = [
    (1, "الأحمدي"),
    (2, "العاصمة"),
    (3, "الفروانية"),
    (4, "حولي"),
    (5, "الجهراء"),
    (6, "مبارك الكبير"),
]


# Areas model
class Area(DynamicSchemaModel):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50)
    governorate = models.IntegerField(choices=GOVERNORATE_CHOICES)
    tags = models.CharField(max_length=250, null=True, blank=True)

    class Meta:
        managed = False
        db_table = "area"
        verbose_name = "المنطقة"
        verbose_name_plural = "المناطق"
        default_permissions = []

    def __str__(self):
        return self.name

