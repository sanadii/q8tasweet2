import pandas as pd
from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.auths.models import User
from apps.campaigns.members.models import CampaignMember
from .utils import read_excel_file, check_required_columns, import_objects_from_df

class Command(BaseCommand):
    help = "Imports or updates users from an Excel file into the database based on the specified schema"

    def add_arguments(self, parser):
        parser.add_argument('election', type=str, help='Election identifier to construct the file path')

    def handle(self, *args, **options):
        # Define the file path
        election = options['election']
        file_path = f"core/management/data/{election}.xlsx"
        work_sheet = "members"
        required_data = [
            "id",
            "first_name",
            "last_name",
            "username",
            "email",
            "password",
            "phone",
            "gender",
        ]

        df = read_excel_file(file_path, work_sheet, required_data, self.stdout)
        if df is None or not check_required_columns(df, required_data, self.stdout):
            return

        created_count, updated_count, processed_users = import_objects_from_df(df, User, self.stdout)

        self.stdout.write(self.style.SUCCESS(f"Import completed for {work_sheet}. Summary:"))
        self.stdout.write(self.style.SUCCESS(f"Created: {created_count} Users"))
        self.stdout.write(self.style.SUCCESS(f"Updated: {updated_count} Users"))

        # Now update CampaignMember model
        campaign_id = 56  # Static for now, you can modify as needed
        election_created_count = 0
        election_updated_count = 0
        for user in processed_users:
            election_user, created = CampaignMember.objects.update_or_create(
                user=user,
                campaign_id=campaign_id,
                defaults={
                    'role': None,  # Replace with actual data if available
                    'phone': user.phone,  # Using phone from user
                    'note': ''  # Replace with actual data if available
                }
            )
            if created:
                election_created_count += 1
            else:
                election_updated_count += 1

        self.stdout.write(self.style.SUCCESS(f"CampaignMember creation completed. Summary:"))
        self.stdout.write(self.style.SUCCESS(f"Created: {election_created_count} CampaignMembers"))
        self.stdout.write(self.style.SUCCESS(f"Updated: {election_updated_count} CampaignMembers"))

        self.stdout.write(self.style.SUCCESS("CampaignMember update completed."))
