
from django.db import models
from django.contrib.auth import get_user_model
from utils.schema import schema_context

class DynamicSchemaModel(models.Model):
    class Meta:
        abstract = True
        managed = False

    def save(self, *args, **kwargs):
        with schema_context(self._schema):
            super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        with schema_context(self._schema):
            super().delete(*args, **kwargs)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)  # Ensures base class initialization
        self._schema = kwargs.get("schema_name", "public")

    def set_schema(self, schema):
        self._schema = schema

    def __str__(self):
        return self.name

    def set_schema(self, schema):
        self._schema = schema


class RelatedSchemaModel(models.Model):
    class Meta:
        abstract = True

    def delete(self, *args, **kwargs):
        request = kwargs.pop("request", None)
        if request:
            slug = request.resolver_match.kwargs.get("slug")
            if slug:
                with schema_context(request, slug):
                    super(RelatedSchemaModel, self).delete(*args, **kwargs)
                    return
        super(RelatedSchemaModel, self).delete(*args, **kwargs)
