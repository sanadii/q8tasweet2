# restapi/configs/models.py
from django.db import models

class Config(models.Model):
    key = models.CharField(max_length=255, unique=True, null=True)
    value = models.TextField(null=True)

    class Meta:
        db_table = "config"
        verbose_name = "Configuration"
        verbose_name_plural = "Configuration"

    def save(self, *args, **kwargs):
        super(Config, self).save(*args, **kwargs)

    def __str__(self):
        return self.key
