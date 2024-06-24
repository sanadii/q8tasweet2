from threading import local

request_cfg = local()


class SchemaDatabaseRouter:
    def db_for_read(self, model, **hints):
        """
        Directs read operations for schema-based models to a specific database.
        """
        schema_name = getattr(model._meta, 'schema', None)
        if schema_name:
            return schema_name  # This assumes your DB alias matches the schema name
        return None

    def db_for_write(self, model, **hints):
        """
        Directs write operations for schema-based models to a specific database.
        """
        return self.db_for_read(model, **hints)

    def allow_relation(self, obj1, obj2, **hints):
        """
        Allow relations if both objects are in the same schema.
        """
        if getattr(obj1._meta, 'schema', None) == getattr(obj2._meta, 'schema', None):
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        Allow migrations to run on the database corresponding to the schema.
        """
        model = hints.get('model')
        if model and getattr(model._meta, 'schema', None) == db:
            return True
        return None



# class ElectionRouter:
#     def db_for_read(self, model, **hints):
#         return getattr(request_cfg, 'db_name', 'default')

#     def db_for_write(self, model, **hints):
#         return getattr(request_cfg, 'db_name', 'default')
