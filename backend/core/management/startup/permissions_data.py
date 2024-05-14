# backend/management/set_permissions.py
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType

# Define the permissions for each model

PERMISSIONS = {
    # Log
    "Logentry": {
        'canViewUser': ['superAdmin', 'admin'],
        'canAddUser': ['superAdmin', 'admin'],
        'canChangeUser': ['superAdmin', 'admin'],
        'canDeleteUser': ['superAdmin', 'admin'],
    },
    "Election": {
        'canViewElection': ['superAdmin', 'admin'],
        'canAddElection': ['superAdmin', 'admin'],
        'canChangeElection': ['superAdmin', 'admin'],
        'canDeleteElection': ['superAdmin', 'admin'],
    },
    "Setting": {
        'canViewSetting': ['superAdmin', 'admin'],
        'canAddSetting': ['superAdmin', 'admin'],
        'canChangeSetting': ['superAdmin', 'admin'],
        'canDeleteSetting': ['superAdmin', 'admin'],
    },
    "Candidate": {
        'canViewCandidate': ['superAdmin', 'admin'],
        'canAddCandidate': ['superAdmin', 'admin'],
        'canChangeCandidate': ['superAdmin', 'admin'],
        'canDeleteCandidate': ['superAdmin', 'admin'],
    },
    "ElectionCandidate": {
        'canViewElectionCandidate': ['superAdmin', 'admin'],
        'canAddElectionCandidate': ['superAdmin', 'admin'],
        'canChangeElectionCandidate': ['superAdmin', 'admin'],
        'canDeleteElectionCandidate': ['superAdmin', 'admin'],
    },
    # Campaigns
    # 'Campaign': {
    #     'canViewCampaign': [
    #         'superAdmin', 'admin', 'campaignModerator', 'campaignCandidate', 
    #         'campaignCoordinator', 'campaignSupervisor', 
    #         'campaignGuarantor', 'campaignAttendant', 'campaignSorter'
    #     ],
    #     'canAddCampaign': ['superAdmin','admin'],
    #     'canChangeCampaign': [
    #         'superAdmin', 'admin', 'campaignModerator', 'campaignCandidate', 
    #         'campaignCoordinator'
    #     ],
    #     'canDeleteCampaign': ['admin'],
    # },

    # 'CampaignMember': {
    #     'canViewCampaignMember': [
    #         'superAdmin', 'admin', 'campaignModerator', 'campaignCandidate', 
    #         'campaignCoordinator', 'campaignSupervisor'
    #     ],
    #     'canAddCampaignMember': ['superAdmin','admin'],
    #     'canChangeCampaignMember': [
    #         'superAdmin', 'admin', 'campaignModerator', 'campaignCandidate', 
    #         'campaignCoordinator', 'campaignSupervisor'
    #     ],
    #     'canDeleteCampaignMember': ['superAdmin','admin'],

    #     # Additional for campaignMembers
    #     'canChangeCampaignModerator': ['superAdmin','admin'],
    #     'canChangeCampaignCandidate': ['superAdmin', 'admin', 'campaignModerator'],
    #     'canChangeCampaignCoordinator': ['superAdmin', 'admin', 'campaignModerator', 'campaignCandidate'], 
    #     'canChangeCampaignSupervisor': ['superAdmin', 'admin', 'campaignModerator', 'campaignCandidate', 'campaignCoordinator'], 
    # },

    # 'CampaignGuarantee': {
    #     'canViewCampaignGuarantee': [
    #         'superAdmin', 'admin', 'campaignModerator', 'campaignCandidate', 'campaignCoordinator', 
    #         'campaignSupervisor', 'campaignGuarantor'
    #     ],
    #     'canAddCampaignGuarantee': [
    #         'superAdmin', 'admin', 'campaignModerator', 'campaignCandidate', 'campaignCoordinator', 
    #         'campaignSupervisor', 'campaignGuarantor'
    #     ],
    #     'canChangeCampaignGuarantee': [
    #         'superAdmin', 'admin', 'campaignModerator', 'campaignCandidate', 'campaignCoordinator', 
    #         'campaignSupervisor', 'campaignGuarantor'
    #     ],
    #     'canDeleteCampaignGuarantee': [
    #         'superAdmin', 'admin', 'campaignModerator', 'campaignCandidate', 'campaignCoordinator', 
    #         'campaignSupervisor', 'campaignGuarantor'
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
                    codename=permission_codename,
                    content_type=content_type
                )
                # Assign the permission to the groups
                for group_role in groups:
                    group, _ = Group.objects.get_or_create(name=group_role)
                    group.permissions.add(permission)
            if created:
                print(f"Created new ContentType for {model}")
        except ContentType.MultipleObjectsReturned:
            print(f"Error: Multiple ContentType entries found for model {model}. Please resolve duplicates.")
        except ContentType.DoesNotExist:
            print(f"Error: ContentType not found for model {model}.")


set_permissions()
