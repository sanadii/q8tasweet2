import pandas as pd
from django.core.management.base import BaseCommand
from django.db.utils import IntegrityError
from apps.auths.models import User
from django.core.files import File
from datetime import datetime
import os

class Command(BaseCommand):
    help = 'Imports users from an Excel file into the database'

    def handle(self, *args, **options):
        # Define the file path
        file_path = 'core/management/data/elections.xlsx'
        df = pd.read_excel(file_path, sheet_name='users')

        # Initialize counters
        created_count = 0
        updated_count = 0
        ignored_count = 0

        # Iterate over each row in the DataFrame
        for index, row in df.iterrows():
            # Assuming 'id' is a unique identifier for users in the Excel file
            user_id = row['id']
            image_path = row['image'] if pd.notna(row['image']) else None
            background_path = row['background'] if pd.notna(row['background']) else None

            image_file = File(open(image_path, 'rb')) if image_path and os.path.exists(image_path) else None
            background_file = File(open(background_path, 'rb')) if background_path and os.path.exists(background_path) else None

            try:
                # Parse date fields
                # date_joined_str = str(row['date_joined'])
                # date_joined_format = '%d-%b-%Y' if '/' in date_joined_str else '%Y-%m-%d'
                # date_joined = datetime.strptime(date_joined_str, date_joined_format)

                # last_login_str = str(row['last_login'])
                # last_login_format = '%d-%b-%Y' if '/' in last_login_str else '%Y-%m-%d'
                # last_login = datetime.strptime(last_login_str, last_login_format)

                # date_of_birth_str = str(row['date_of_birth'])
                # date_of_birth_format = '%d-%b-%Y' if '/' in date_of_birth_str else '%Y-%m-%d'
                # date_of_birth = datetime.strptime(date_of_birth_str, date_of_birth_format)

                # Create or update User object
                user, created = User.objects.update_or_create(
                    defaults={
                        'username': row['username'],
                        'email': row['email'],
                        'password': row['password'],
                        'is_superuser': row['is_superuser'],
                        'first_name': row['first_name'],
                        'last_name': row['last_name'],
                        'image': row['image'],
                        'background': row['background'],
                        'civil': row['civil'],
                        'gender': row['gender'],
                        'description': row['description'],
                        'phone': row['phone'],
                        'twitter': row['twitter'],
                        'instagram': row['instagram'],
                        'is_staff': row['is_staff'],
                        'is_active': row['is_active'],
                        'token': row['token'],
                        'token_expiry': row['token_expiry'],
                        
                        # 'date_joined': date_joined,
                        # 'last_login': last_login,
                        # 'date_of_birth': date_of_birth,

                    },
                    id=user_id
                )

                if created:
                    created_count += 1
                    self.stdout.write(self.style.SUCCESS(f'Created new user: {user.username}'))
                else:
                    updated_count += 1
                    self.stdout.write(self.style.SUCCESS(f'Updated user: {user.username}'))

            except IntegrityError as e:
                # Handle any integrity errors
                self.stdout.write(self.style.WARNING(f'Failed to import user: {row["username"]}. Error: {str(e)}'))
                ignored_count += 1
                continue

        # Print summary
        self.stdout.write(self.style.SUCCESS('Import completed. Summary:'))
        self.stdout.write(self.style.SUCCESS(f'Created: {created_count} users'))
        self.stdout.write(self.style.SUCCESS(f'Updated: {updated_count} users'))
        self.stdout.write(self.style.SUCCESS(f'Ignored: {ignored_count} entries due to errors'))
