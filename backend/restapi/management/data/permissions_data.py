# backend/management/set_permissions.py
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType

# Define the permissions for each model

PERMISSIONS = {
    'Campaign': {
        'canViewCampaign': [
            'admin', 'campaignModerator', 'campaignCandidate', 
            'campaignManager', 'campaignSupervisor', 
            'campaignGuarantor', 'campaignAttendant', 'campaignSorter'
        ],
        'canAddCampaign': ['admin'],
        'canChangeCampaign': [
            'admin', 'campaignModerator', 'campaignCandidate', 
            'campaignManager', 'campaignAssistant'
        ],
        'canDeleteCampaign': ['admin'],
    },

    'CampaignMember': {
        'canViewCampaignMember': [
            'admin', 'campaignModerator', 'campaignCandidate', 
            'campaignManager', 'campaignSupervisor'
        ],
        'canAddCampaignMember': ['admin'],
        'canChangeCampaignMember': [
            'admin', 'campaignModerator', 'campaignCandidate', 
            'campaignManager', 'campaignSupervisor'
        ],
        'canDeleteCampaignMember': ['admin'],
        'canChangeCampaignModerator': ['admin'],
        'canChangeCampaignCandidate': ['admin', 'campaignModerator'],
        'canChangeCampaignManager': [
            'admin', 'campaignModerator', 'campaignCandidate'
        ],
        'canChangeCampaignAssistant': [
            'admin', 'campaignModerator', 'campaignCandidate', 'campaignManager'
        ],
    },

    'CampaignGuarantee': {
        'canViewCampaignGuarantee': [
            'admin', 'campaignModerator', 'campaignCandidate', 'campaignManager', 
            'campaignSupervisor', 'campaignGuarantor'
        ],
        'canAddCampaignGuarantee': [
            'admin', 'campaignModerator', 'campaignCandidate', 'campaignManager', 
            'campaignSupervisor', 'campaignGuarantor'
        ],
        'canChangeCampaignGuarantee': [
            'admin', 'campaignModerator', 'campaignCandidate', 'campaignManager', 
            'campaignSupervisor', 'campaignGuarantor'
        ],
        'canDeleteCampaignGuarantee': [
            'admin', 'campaignModerator', 'campaignCandidate', 'campaignManager', 
            'campaignSupervisor', 'campaignGuarantor'
        ],
    },

    'CampaignAttendee': {
        'canViewCampaignAttendee': [
            'admin', 'campaignModerator', 'campaignCandidate', 'campaignManager', 
            'campaignSupervisor', 'campaignGuarantor', 
            'campaignAttendant', 'campaignSorter'
        ],
        'canAddCampaignAttendee': ['admin', 'campaignSorter'],
        'canDeleteCampaignAttendee': ['admin', 'campaignSorter'],
        'canChangeCampaignAttendee': ['admin', 'campaignSorter'],
    },

    'Elector': {
        'canViewElector': [
            'admin', 'campaignModerator', 'campaignCandidate', 'campaignManager', 
            'campaignSupervisor', 'campaignGuarantor', 
            'campaignAttendant', 'campaignSorter'
        ],
    },
    
    # 'CampaignSorting': {
    #     'canViewCampaignSorting': ['admin', 'campaignSorter'],
    #     'canAddCampaignSorting': ['admin', 'campaignSorter'],
    #     'canChangeCampaignSorting': ['admin', 'campaignSorter'],
    #     'canDeleteCampaignSorting': ['admin', 'campaignSorter'],
    # },
}

def set_permissions():
    for model, permissions in PERMISSIONS.items():
        print(f"Fetching ContentType for model: {model}")
        
        content_type = ContentType.objects.get(model=model.lower())
        for permission_codename, groups in permissions.items():
            # Create the permission if it doesn't exist
            permission, _ = Permission.objects.get_or_create(
                codename=permission_codename,
                content_type=content_type
            )
            # Assign the permission to the groups
            for group_role in groups:
                group, _ = Group.objects.get_or_create(role=group_role)
                group.permissions.add(permission)

set_permissions()
