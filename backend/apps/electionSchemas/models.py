from django.db import models
from contextlib import contextmanager
from django.db import connection

from utils.models import GENDER_CHOICES


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
