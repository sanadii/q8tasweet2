import pandas as pd
from django.core.management.base import BaseCommand
from django.db.utils import IntegrityError
from apps.auths.models import User  # Assuming Django's default User model

class Command(BaseCommand):
    help = 'Imports users from a CSV file into the database'

    def handle(self, *args, **options):
        # Define the file path
        file_path = 'core/management/data/users.csv'

        # Read data from CSV file
        df = pd.read_csv(file_path)

        # Initialize counters
        created_count = 0
        updated_count = 0
        ignored_count = 0

        # Iterate over each row in the DataFrame
        for index, row in df.iterrows():
            # Assuming 'id' is a unique identifier for users in the CSV file
            user_id = row['id']
            try:
                # Try to update the user if it already exists
                user, created = User.objects.update_or_create(
                    defaults={
                        'username': row['username'],
                        'email': row['email'],
                        'password': row['password'],  # Assuming password is stored in plaintext for simplicity (not recommended in production)
                        # Add other fields as needed
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
                # If there is an IntegrityError, it likely means that there is a duplicate entry or other data issue
                self.stdout.write(self.style.WARNING(f'Failed to import user: {row["username"]}. Error: {str(e)}'))
                ignored_count += 1
                continue

        # Print summary
        self.stdout.write(self.style.SUCCESS('Import completed. Summary:'))
        self.stdout.write(self.style.SUCCESS(f'Created: {created_count} users'))
        self.stdout.write(self.style.SUCCESS(f'Updated: {updated_count} users'))
        self.stdout.write(self.style.SUCCESS(f'Ignored: {ignored_count} entries due to errors'))
