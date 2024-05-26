from django.db import models
from django.contrib.auth import get_user_model
from contextlib import contextmanager
from django.db import connection
from utils.models import GENDER_CHOICES
from apps.schemas.schema import schema_context



class DynamicSchemaModel(models.Model):
    class Meta:
        abstract = True
        managed = False

    # def save(self, *args, **kwargs):
    #     with schema_context(self._schema):
    #         super().save(*args, **kwargs)

    # def delete(self, *args, **kwargs):
    #     with schema_context(self._schema):
    #         super().delete(*args, **kwargs)

    # def __init__(self, *args, **kwargs):
    #     super().__init__(*args, **kwargs)  # Ensures base class initialization
    #     self._schema = kwargs.get("schema_name", "public")

    # def set_schema(self, schema):
    #     self._schema = schema

    # def __str__(self):
    #     return self.name

    # def set_schema(self, schema):
    #     self._schema = schema


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

# class DynamicSchemaModel(models.Model):
#     class Meta:
#         abstract = True

#     _schema = None

#     def set_schema(self, schema):
#         self._schema = schema

#     def save(self, *args, **kwargs):
#         # Set the schema to be used for saving this instance
#         if self._schema:
#             with schema_context(self._schema):
#                 super().save(*args, **kwargs)
#         else:
#             super().save(*args, **kwargs)


# @contextmanager
# def schema_context(schema_name):
#     with connection.cursor() as cursor:
#         cursor.execute("SHOW search_path")
#         old_schema = cursor.fetchone()
#         if old_schema:
#             old_schema = old_schema[0]  # Ensure you get the string value of the search path
#         try:
#             cursor.execute(f"SET search_path TO {schema_name}")
#             yield
#         finally:
#             if old_schema:
#                 cursor.execute(f"SET search_path TO {old_schema}")

# # Usage
# with schema_context('dynamic_schema'):
#     committee = Committee(name="New Committee")
#     committee.save()
