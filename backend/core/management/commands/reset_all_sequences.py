from django.core.management.base import BaseCommand
from django.apps import apps
from django.db import connection

class Command(BaseCommand):
    help = 'Resets the sequences for all tables'

    def handle(self, *args, **options):
        with connection.cursor() as cursor:
            for model in apps.get_models():
                table_name = model._meta.db_table
                cursor.execute(f"SELECT column_name FROM information_schema.columns WHERE table_name='{table_name}' AND column_default LIKE 'nextval%'")
                sequence_columns = cursor.fetchall()
                
                if sequence_columns:
                    for column in sequence_columns:
                        column_name = column[0]
                        cursor.execute(f"SELECT MAX({column_name}) FROM {table_name}")
                        max_id = cursor.fetchone()[0]
                        
                        if max_id is not None:
                            sequence_name = f"{table_name}_{column_name}_seq"
                            cursor.execute(f"SELECT setval(pg_get_serial_sequence('{table_name}', '{column_name}'), %s)", [max_id])
                            self.stdout.write(self.style.SUCCESS(
                                f"Successfully reset the sequence {sequence_name} for {table_name} to {max_id}"
                            ))
                        else:
                            self.stdout.write(self.style.WARNING(
                                f"No data in {table_name} to reset the sequence {sequence_name}"
                            ))

