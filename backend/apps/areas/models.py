from django.db import models

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
class Area(models.Model):
    name = models.CharField(max_length=50)
    code = models.CharField(max_length=30)
    governorate = models.IntegerField(choices=GOVERNORATE_CHOICES)

    class Meta:
        db_table = "area"
        verbose_name = "Area"
        verbose_name_plural = "Areas"
        default_permissions = []

    def __str__(self):
        return self.name


# class AreaBlock(models.Model):
#     name = models.CharField(max_length=50)
#     code = models.CharField(max_length=30)
#     area = models.FKey(area)
