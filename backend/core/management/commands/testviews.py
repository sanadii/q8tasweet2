from django.db.migrations.executor import MigrationExecutor
from django.db import connections

def check_migration(app_label, migration_name):
    connection = connections['default']
    executor = MigrationExecutor(connection)
    plan = executor.migration_plan(executor.loader.graph.leaf_nodes())
    return any(migration.app_label == app_label and migration.name == migration_name for migration, _ in plan)

# Usage
print(check_migration('your_app_name', 'name_of_migration_file'))
