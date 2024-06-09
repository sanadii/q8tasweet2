
from django.db import models, connection
from django.core.exceptions import FieldDoesNotExist
from utils.schema import schema_context

class DynamicSchemaModel(models.Model):
    class Meta:
        abstract = True
        managed = False

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        schema_name = kwargs.get("schema_name")
        self.set_schema(schema_name)
        
        self.election_category = None

    def set_schema(self, schema):
        self._schema = schema

    def add_dynamic_fields(self, election_category, schema_editor):
        self.election_category = election_category
        print(f"Election Category in Model: {self.election_category}")

        dynamic_fields = self.get_dynamic_fields()

        for field_name, field in dynamic_fields.items():
            try:
                self._meta.get_field(field_name)
                field_exists = True
            except FieldDoesNotExist:
                field_exists = False

            if not field_exists:
                field.contribute_to_class(self.__class__, field_name)
                print(f"Added dynamic field: {field_name}")

        self.ensure_dynamic_fields_in_db(schema_editor)

    def ensure_dynamic_fields_in_db(self, schema_editor):
        dynamic_fields = self.get_dynamic_fields()

        for field_name, field in dynamic_fields.items():
            with connection.cursor() as cursor:
                cursor.execute(
                    f"""
                    SELECT column_name
                    FROM information_schema.columns
                    WHERE table_name = '{self._meta.db_table}'
                      AND column_name = '{field_name}';
                """
                )
                column_exists = cursor.fetchone() is not None

            if not column_exists:
                dynamic_field = self._meta.get_field(field_name)
                schema_editor.add_field(self.__class__, dynamic_field)

    def get_dynamic_fields(self):
        return {}

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
