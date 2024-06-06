from django.core.management.base import BaseCommand
from django.db import connection
from django.apps import apps

class Command(BaseCommand):
    help = 'Resets primary key sequences for all models'

    def handle(self, *args, **kwargs):
        with connection.cursor() as cursor:
            for app_config in apps.get_app_configs():
                for model in app_config.get_models():
                    if not model._meta.managed:
                        self.stdout.write(self.style.WARNING(f"Skipping {model._meta.db_table}, managed is set to False"))
                        continue

                    table_name = model._meta.db_table
                    sequence_name = f"{table_name}_id_seq"

                    # Check if the table exists
                    cursor.execute(f"""
                        SELECT EXISTS (
                            SELECT FROM information_schema.tables 
                            WHERE table_name = '{table_name}'
                        );
                    """)
                    table_exists = cursor.fetchone()[0]

                    if table_exists:
                        # Check if the table has an 'id' column
                        cursor.execute(f"""
                            SELECT column_name
                            FROM information_schema.columns
                            WHERE table_name = '{table_name}' AND column_name = 'id';
                        """)
                        if cursor.fetchone():
                            try:
                                cursor.execute(f"SELECT setval('{sequence_name}', (SELECT COALESCE(MAX(id), 1) FROM {table_name}) + 1);")
                                self.stdout.write(self.style.SUCCESS(f"Reset sequence for {table_name}"))
                            except Exception as e:
                                self.stdout.write(self.style.ERROR(f"Failed to reset sequence for {table_name}: {str(e)}"))
                        else:
                            self.stdout.write(self.style.WARNING(f"Skipping {table_name}, no 'id' column found"))
                    else:
                        self.stdout.write(self.style.WARNING(f"Skipping {table_name}, table does not exist"))
