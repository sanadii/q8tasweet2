# restapi/configs/models.py
from django.db import models

class Config(models.Model):
    key = models.CharField(max_length=255, unique=True, null=True)
    value = models.TextField(null=True)

    class Meta:
        db_table = "config"
        verbose_name = "Configuration"
        verbose_name_plural = "Configuration"
        default_permissions = []
        permissions  = [
            ("canViewConfig", "Can View Config"),
            ("canAddConfig", "Can Add Config"),
            ("canChangeConfig", "Can Change Config"),
            ("canDeleteConfig", "Can Delete Config"),
            ]
    def save(self, *args, **kwargs):
        super(Config, self).save(*args, **kwargs)

    def __str__(self):
        return self.key
