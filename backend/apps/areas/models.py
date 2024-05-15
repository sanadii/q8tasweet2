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
    code = models.CharField(max_length=50)
    governorate = models.IntegerField(choices=GOVERNORATE_CHOICES)
    tags = models.CharField(max_length=250, null=True, blank=True)

    class Meta:
        managed = False
        db_table = "area"
        verbose_name = "المنطقة"
        verbose_name_plural = "المناطق"
        default_permissions = []

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)  # Ensures base class initialization
        schema_name = kwargs.get("schema_name", "public")
        self.set_schema(schema_name)  # Dynamically sets the schema if provided

    def __str__(self):
        return self.name

    def set_schema(self, schema):
        self._schema = schema
