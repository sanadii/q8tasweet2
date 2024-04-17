import os
import pandas as pd
from django.core.management.base import BaseCommand
from django.db.utils import IntegrityError
from apps.auths.models import User
from django.core.files import File
from django.core.exceptions import ValidationError  # <-- Add this import
from utils.validators import today, civil_validator, phone_validator  


class Command(BaseCommand):
    help = "Imports users from an Excel file into the database"

    def handle(self, *args, **options):
        file_path = "core/management/data/elections.xlsx"
        df = pd.read_excel(file_path, sheet_name="users")

        created_count = 0
        updated_count = 0
        ignored_count = 0

        for index, row in df.iterrows():
            user_id = row["id"]
            image_path = row["image"] if pd.notna(row["image"]) else None
            background_path = row["background"] if pd.notna(row["background"]) else None

            image_file = None
            background_file = None
            if image_path and os.path.exists(image_path):
                image_file = File(open(image_path, "rb"))
            if background_path and os.path.exists(background_path):
                background_file = File(open(background_path, "rb"))


            # Check if the gender is valid or set to default
            gender_value = row.get('gender')
            if pd.isna(gender_value) or gender_value == '':
                gender_value = None  # Or use GenderOptions.UNDEFINED or any default you prefer


            civil_value = str(int(row['civil'])) if pd.notna(row['civil']) else None
            phone_value = str(int(row['phone'])) if pd.notna(row['phone']) else None
            # Validate the civil number
            try:
                civil_validator(civil_value)
            except ValidationError as e:
                self.stdout.write(self.style.WARNING(f"Invalid civil number for user {row['username']}: {e}"))
                ignored_count += 1
                continue  # Skip this user and go to the next row


            try:
                user, created = User.objects.update_or_create(
                    defaults={
                        "username": row["username"],
                        "email": row["email"],
                        "password": row["password"],
                        "is_superuser": row["is_superuser"],
                        "first_name": row["first_name"],
                        "last_name": row["last_name"],
                        'description': row['description'],
                        
                        'twitter': row['twitter'],
                        'instagram': row['instagram'],
                        'is_staff': row['is_staff'],
                        'is_active': row['is_active'],
                        'token': row['token'],
                        # 'token_expiry': row['token_expiry'],
                        
                        
                        # image, Gender validation if nan, None
                        "image": image_file,
                        "background": background_file,
                        'gender': gender_value,
                        
                        # Number Validation
                        "civil": civil_value,  # Use the cleaned civil_value
                        'phone': phone_value,
                        
                        
                        # DateTime Validation
                    },
                    id=user_id,
                )
                if created:
                    created_count += 1
                    self.stdout.write(
                        self.style.SUCCESS(f"Created new user: {user.username}")
                    )
                else:
                    updated_count += 1
                    self.stdout.write(
                        self.style.SUCCESS(f"Updated user: {user.username}")
                    )

                # Close files after they are no longer needed
                if image_file:
                    image_file.close()
                if background_file:
                    background_file.close()

            except IntegrityError as e:
                self.stdout.write(
                    self.style.WARNING(
                        f'Failed to import user: {row["username"]}. Error: {str(e)}'
                    )
                )
                ignored_count += 1
                continue

        self.stdout.write(self.style.SUCCESS("Import completed. Summary:"))
        self.stdout.write(self.style.SUCCESS(f"Created: {created_count} users"))
        self.stdout.write(self.style.SUCCESS(f"Updated: {updated_count} users"))
        self.stdout.write(
            self.style.SUCCESS(f"Ignored: {ignored_count} entries due to errors")
        )
