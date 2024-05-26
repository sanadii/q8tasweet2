from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from django.db import IntegrityError

# Define the permissions for each model
PERMISSIONS = {
    # Log
    "Logentry": {
        "canViewUser": ["superAdmin", "admin"],
        "canAddUser": ["superAdmin", "admin"],
        "canChangeUser": ["superAdmin", "admin"],
        "canDeleteUser": ["superAdmin", "admin"],
    },
    "Election": {
        "canViewElection": ["superAdmin", "admin"],
        "canAddElection": ["superAdmin", "admin"],
        "canChangeElection": ["superAdmin", "admin"],
        "canDeleteElection": ["superAdmin", "admin"],
    },
    "Setting": {
        "canViewSetting": ["superAdmin", "admin"],
        "canAddSetting": ["superAdmin", "admin"],
        "canChangeSetting": ["superAdmin", "admin"],
        "canDeleteSetting": ["superAdmin", "admin"],
    },
    "Candidate": {
        "canViewCandidate": ["superAdmin", "admin"],
        "canAddCandidate": ["superAdmin", "admin"],
        "canChangeCandidate": ["superAdmin", "admin"],
        "canDeleteCandidate": ["superAdmin", "admin"],
    },
    "ElectionCandidate": {
        "canViewElectionCandidate": ["superAdmin", "admin"],
        "canAddElectionCandidate": ["superAdmin", "admin"],
        "canChangeElectionCandidate": ["superAdmin", "admin"],
        "canDeleteElectionCandidate": ["superAdmin", "admin"],
    },
        "Elector": {
        "canViewElector": ["superAdmin", "admin"],
        "canAddElector": ["superAdmin", "admin"],
        "canChangeElector": ["superAdmin", "admin"],
        "canDeleteElector": ["superAdmin", "admin"],
    },
      "Campaign": {
        "canViewCampaign": [
            'superAdmin', 'admin', 'campaignModerator', 
            'partyAdmin', 'campaignCandidate', 'campaignAdmin',
            'campaignFieldAdmin', 'campaignFieldAgent', 'campaignFieldDelegate',
            'campaignDigitalAdmin', 'campaignDigitalAgent', 'campaignDigitalDelegate'
        ],
        "canAddCampaign": ["superAdmin", "admin"],
        "canChangeCampaign": [
            "superAdmin", "admin", "campaignModerator",
            'partyAdmin', 'campaignCandidate', 'campaignAdmin',
            ],
        "canDeleteCampaign": ["admin"],
    },
    # Campaigns

    "CampaignMember": {
        "canViewCampaignMember": [
            "superAdmin", "admin", "campaignModerator",
            'partyAdmin', 'campaignCandidate', 'campaignAdmin',
            'campaignFieldAdmin', 'campaignFieldAgent',
            'campaignDigitalAdmin', 'campaignDigitalAgent'
        ],
        "canAddCampaignMember": ["superAdmin", "admin"],
        "canChangeCampaignMember": [
            "superAdmin", "admin", "campaignModerator",
            'partyAdmin', 'campaignCandidate', 'campaignAdmin',
            'campaignFieldAdmin', 'campaignFieldAgent',
            'campaignDigitalAdmin', 'campaignDigitalAgent'        ],
        "canDeleteCampaignMember": ["superAdmin", "admin"],
        # Additional for campaignMembers
        "canChangeCampaignModerator": ["superAdmin", "admin"],
        "canChangeCampaignCandidate": ["superAdmin", "admin", "campaignModerator"],
        "canChangeCampaignCoordinator": [
            "superAdmin", "admin", "campaignModerator", "campaignCandidate",
        ],
        "canChangeCampaignSupervisor": [
            "superAdmin", "admin",
            "campaignModerator", "campaignCandidate", "campaignCoordinator",
        ],
    },
    'CampaignGuarantee': {
        'canViewCampaignGuarantee': [
            'superAdmin', 'admin', 'campaignModerator',
            'partyAdmin', 'campaignCandidate', 'campaignAdmin',
            'campaignFieldAdmin', 'campaignFieldAgent', 'campaignFieldDelegate',
            'campaignDigitalAdmin', 'campaignDigitalAgent', 'campaignDigitalDelegate'
        ],
        'canAddCampaignGuarantee': [
            'superAdmin', 'admin', 'campaignModerator', 
            'partyAdmin', 'campaignCandidate', 'campaignAdmin',
            'campaignFieldAdmin', 'campaignFieldAgent', 'campaignFieldDelegate',
            'campaignDigitalAdmin', 'campaignDigitalAgent', 'campaignDigitalDelegate'
        ],
        'canChangeCampaignGuarantee': [
            'superAdmin', 'admin', 'campaignModerator',
            'partyAdmin', 'campaignCandidate', 'campaignAdmin',
            'campaignFieldAdmin', 'campaignFieldAgent', 'campaignFieldDelegate',
            'campaignDigitalAdmin', 'campaignDigitalAgent', 'campaignDigitalDelegate'
        ],
        'canDeleteCampaignGuarantee': [
            'superAdmin', 'admin', 'campaignModerator',
            'partyAdmin', 'campaignCandidate', 'campaignAdmin',
            'campaignFieldAdmin', 'campaignFieldAgent', 'campaignFieldDelegate',
            'campaignDigitalAdmin', 'campaignDigitalAgent', 'campaignDigitalDelegate'
        ],
    },
    #  'CampaignGuaranteeGroup': {
    #     'canViewCampaignGuaranteeGroup': [
    #         'superAdmin', 'admin', 'campaignModerator',
    #         'partyAdmin', 'campaignCandidate', 'campaignAdmin',
    #         'campaignFieldAdmin', 'campaignFieldAgent', 'campaignFieldDelegate',
    #         'campaignDigitalAdmin', 'campaignDigitalAgent', 'campaignDigitalDelegate'
    #     ],
    #     'canAddCampaignGuaranteeGroup': [
    #         'superAdmin', 'admin', 'campaignModerator',
    #         'partyAdmin', 'campaignCandidate', 'campaignAdmin',
    #         'campaignFieldAdmin', 'campaignFieldAgent', 'campaignFieldDelegate',
    #         'campaignDigitalAdmin', 'campaignDigitalAgent', 'campaignDigitalDelegate'
    #     ],
    #     'canChangeCampaignGuaranteeGroup': [
    #         'superAdmin', 'admin', 'campaignModerator',
    #         'partyAdmin', 'campaignCandidate', 'campaignAdmin',
    #         'campaignFieldAdmin', 'campaignFieldAgent', 'campaignFieldDelegate',
    #         'campaignDigitalAdmin', 'campaignDigitalAgent', 'campaignDigitalDelegate'
    #     ],
    #     'canDeleteCampaignGuaranteeGroup': [
            # 'superAdmin', 'admin', 'campaignModerator',
            # 'partyAdmin', 'campaignCandidate', 'campaignAdmin',
            # 'campaignFieldAdmin', 'campaignFieldAgent', 'campaignFieldDelegate',
            # 'campaignDigitalAdmin', 'campaignDigitalAgent', 'campaignDigitalDelegate'
    #     ],
    # },
    # 'CampaignAttendee': {
    #     'canViewCampaignAttendee': [
    #         'superAdmin', 'admin', 'campaignModerator', 'campaignCandidate', 'campaignCoordinator',
    #         'campaignSupervisor', 'campaignGuarantor',
    #         'campaignAttendant', 'campaignSorter'
    #     ],
    #     'canAddCampaignAttendee': ['superAdmin', 'admin', 'campaignSorter'],
    #     'canDeleteCampaignAttendee': ['superAdmin', 'admin', 'campaignSorter'],
    #     'canChangeCampaignAttendee': ['superAdmin', 'admin', 'campaignSorter'],
    # },
    # 'Voter': {
    #     'canViewVoter': [
    #         'superAdmin', 'admin', 'campaignModerator', 'campaignCandidate', 'campaignCoordinator',
    #         'campaignSupervisor', 'campaignGuarantor',
    #         'campaignAttendant', 'campaignSorter'
    #     ],
    # },
    # 'CampaignSorting': {
    #     'canViewCampaignSorting': ['superAdmin', 'admin', 'campaignSorter'],
    #     'canAddCampaignSorting': ['superAdmin', 'admin', 'campaignSorter'],
    #     'canChangeCampaignSorting': ['superAdmin', 'admin', 'campaignSorter'],
    #     'canDeleteCampaignSorting': ['superAdmin', 'admin', 'campaignSorter'],
    # },
}


def set_permissions():
    for model, permissions in PERMISSIONS.items():
        print(f"Fetching ContentType for model: {model}")

        try:
            content_type = ContentType.objects.get(model=model.lower())
            for permission_codename, groups in permissions.items():
                # Create the permission if it doesn't exist
                permission, created = Permission.objects.get_or_create(
                    codename=permission_codename, content_type=content_type
                )
                if created:
                    print(
                        f"Created new permission: {permission_codename} for model {model}"
                    )

                # Assign the permission to the groups
                for group_codename in groups:
                    try:
                        group, created = Group.objects.get_or_create(
                            codename=group_codename
                        )
                        if created:
                            print(f"Created new group: {group_codename}")
                        group.permissions.add(permission)
                    except IntegrityError:
                        print(
                            f"IntegrityError: Skipping group {group_codename} as it already exists."
                        )
                        continue

        except ContentType.MultipleObjectsReturned:
            print(
                f"Error: Multiple ContentType entries found for model {model}. Please resolve duplicates."
            )
        except ContentType.DoesNotExist:
            print(f"Error: ContentType not found for model {model}.")


class Command(BaseCommand):
    help = "Set Group Permissions"

    def handle(self, *args, **kwargs):
        # Set new permissions
        set_permissions()
        self.stdout.write(self.style.SUCCESS("Permissions set successfully!"))
