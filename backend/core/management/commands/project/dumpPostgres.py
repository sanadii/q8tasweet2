import subprocess
import os
from django.core.management.base import BaseCommand
from django.conf import settings

class Command(BaseCommand):
    help = 'Dumps the PostgreSQL database into a single file with UTF-8 encoding.'

    def add_arguments(self, parser):
        parser.add_argument('-p', '--path', type=str, help='Path where the dump should be saved')

    def handle(self, *args, **options):
        dump_path = options['path'] if options['path'] else os.path.join(settings.BASE_DIR, 'db_backup.dump')

        pg_dump_path = os.path.join('C:\\', 'Program Files', 'PostgreSQL', '16', 'bin', 'pg_dump.exe')

        command = [
            pg_dump_path,
            '-U', settings.DATABASES['default']['USER'],
            '-h', settings.DATABASES['default']['HOST'],
            '-p', str(settings.DATABASES['default']['PORT']),
            '-F', 'c',  # Use the custom format
            '-f', dump_path,
            '--encoding', 'UTF8',
            settings.DATABASES['default']['NAME']
        ]

        env = os.environ.copy()
        env['PGPASSWORD'] = settings.DATABASES['default']['PASSWORD']

        try:
            subprocess.run(command, check=True, env=env)
            self.stdout.write(self.style.SUCCESS(f'Successfully dumped the database to {dump_path}'))
        except subprocess.CalledProcessError as e:
            self.stderr.write(self.style.ERROR('Failed to dump the database'))
            self.stderr.write(self.style.ERROR(str(e)))
