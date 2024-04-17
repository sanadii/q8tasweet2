# Inside your_app/management/commands/dumpdata_utf8.py

from django.core.management.commands.dumpdata import Command as DumpdataCommand
import json
import os

class Command(DumpdataCommand):
    def handle(self, *args, **options):
        super().handle(*args, **options)
        data = self.stdout.getvalue()
        workspace_dir = os.path.dirname(os.path.abspath(__file__))
        workspace_dir = os.path.join("D:")  # Adjust for D: drive
        file_path = os.path.join(workspace_dir, 'sqlitedata.json')
        print("File path:", file_path)  # Add this line for debugging
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(data)
