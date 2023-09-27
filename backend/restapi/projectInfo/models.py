# Categories Model
from django.db import models

class ProjectInfo(models.Model):
    data = models.JSONField()

    def __str__(self):
        return str(self.id)
