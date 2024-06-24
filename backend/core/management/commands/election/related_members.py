import pandas as pd
from django.contrib.auth.models import Group
from apps.auths.models import User
from apps.campaigns.members.models import CampaignMember
from ..utils.helper import read_excel_file, check_required_columns, import_objects_from_df
from ..utils.logging import log_import_summary, log_reading_file, log_imported_fields, log_error

def import_election_related_members(file_name, file_path, campaign, command):
    log_reading_file(command, file_name, file_path, "members")
    required_data_members = [
        "id", "first_name", "last_name", "username", "email", "password", "phone", "gender", "role"
    ]

    df_members = read_excel_file(file_path, "members", required_data_members, command)
    if df_members is None or not check_required_columns(df_members, required_data_members, command):
        log_error(command, f"Missing required columns in DataFrame. Required: {required_data_members}, Found: {df_members.columns.tolist() if df_members is not None else 'None'}")
        return []

    log_imported_fields(command, df_members)

    created_members = []

    for _, row in df_members.iterrows():
        try:
            role_value = str(row["role"])
            if role_value.isdigit():
                role_group = Group.objects.get(id=role_value)
            else:
                role_group = Group.objects.get(name=role_value)
        except Group.DoesNotExist:
            log_error(command, f"Role '{row['role']}' does not exist. Skipping member creation.")
            continue

        user, created = User.objects.update_or_create(
            username=row["username"],
            defaults={
                'first_name': row["first_name"],
                'last_name': row["last_name"],
                'email': row["email"],
                'phone': row["phone"],
                'gender': row["gender"],
            }
        )
        if created:
            user.set_password(row["password"])
            user.save()

        campaign_member, created = CampaignMember.objects.update_or_create(
            campaign=campaign,
            user=user,
            defaults={
                'role': role_group
            }
        )
        action = "Created" if created else "Updated"
        command.stdout.write(command.style.SUCCESS(f"{action} CampaignMember for User ID {user.id}"))
        created_members.append(campaign_member)

    return created_members
