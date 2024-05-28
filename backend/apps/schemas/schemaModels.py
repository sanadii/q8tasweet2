from django.db import models
from utils.schema import schema_context

class DynamicSchemaModel(models.Model):
    class Meta:
        abstract = True
        managed = False

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        schema_name = kwargs.get("schema_name")
        self.set_schema(schema_name)

    def set_schema(self, schema):
        self._schema = schema
        
    def delete(self, *args, **kwargs):
        if hasattr(self, '_schema') and self._schema:
            with schema_context(self._schema):
                super().delete(*args, **kwargs)
        else:
            super().delete(*args, **kwargs)


class RelatedSchemaModel(models.Model):
    class Meta:
        abstract = True

    def delete(self, *args, **kwargs):
        request = kwargs.pop("request", None)
        if request:
            slug = request.resolver_match.kwargs.get("slug")
            if slug:
                with schema_context(slug):
                    super(RelatedSchemaModel, self).delete(*args, **kwargs)
                    return
        super(RelatedSchemaModel, self).delete(*args, **kwargs)
