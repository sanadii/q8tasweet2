from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from django.apps import apps

def set_permissions():
    # Model permissions defined here
    model_permissions = {
        'Campaign': {
            'view': [
                'superAdmin', 'admin', 'campaignModerator',
                'partyAdmin', 'campaignCandidate', 'campaignAdmin', 'campaignFieldAdmin',
                'campaignFieldAgent', 'campaign Delegate',
                'campaignDigitalAdmin', 'campaignDigitalAgent', 'campaignDelegate'
                ],
            'add': [
                'superAdmin', 'admin'
                ],
            'change':[
                'superAdmin', 'admin',
                'partyAdmin', 'campaignCandidate', 'campaignAdmin'
                ],
            'delete': [
                'superAdmin', 'admin'
                ],
        },
        
        'CampaignMember': {
            'view': [
                'superAdmin', 'admin', 'campaignModerator',
                'partyAdmin', 'campaignCandidate', 'campaignAdmin',
                'campaignFieldAdmin', 'campaignDigitalAdmin'
                ],
            'add': [
                'superAdmin', 'admin'
                ],
            'change': [
                'superAdmin', 'admin',
                'partyAdmin', 'campaignCandidate', 'campaignAdmin',
                'campaignFieldAdmin', 'campaignDigitalAdmin'
                ],
            'delete': [
                'superAdmin', 'admin'
                ],
        },
        
        'CampaignGuarantee': {
            'view': [
                'superAdmin', 'admin',
                'partyAdmin', 'campaignCandidate', 'campaignAdmin',
                'campaignFieldAdmin', 'campaignDigitalAdmin'
                'campaignDigitalAdmin', 'campaignDigitalAgent', 'campaignDelegate'
            ],
            'add': [
                'superAdmin', 'admin',
                'partyAdmin', 'campaignCandidate', 'campaignAdmin',
                'campaignFieldAdmin', 'campaignDigitalAdmin'
                'campaignDigitalAdmin', 'campaignDigitalAgent', 'campaignDelegate'
            ],
            'change': [
                'superAdmin', 'admin',
                'partyAdmin', 'campaignCandidate', 'campaignAdmin',
                'campaignFieldAdmin', 'campaignDigitalAdmin'
                'campaignDigitalAdmin', 'campaignDigitalAgent', 'campaignDelegate'
            ],
            'delete': [
                'superAdmin', 'admin',
                'partyAdmin', 'campaignCandidate', 'campaignAdmin',
                'campaignFieldAdmin', 'campaignDigitalAdmin'
                'campaignDigitalAdmin', 'campaignDigitalAgent', 'campaignDelegate'
            ],
        }
 

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

    # Loop over each model and its permissions
    for model_name, permissions in model_permissions.items():
        # Get the model's content type
        model = apps.get_model(app_label='your_app_label', model_name=model_name)
        content_type = ContentType.objects.get_for_model(model)

        # Process each permission type (view, add, change, delete)
        for perm_type, roles in permissions.items():
            # Generate the full codename for the permission
            codename = f'can_{perm_type}_{model_name.lower()}'
            name = f'Can {perm_type} {model_name}'

            # Create or get the permission
            permission, created = Permission.objects.get_or_create(
                codename=codename,
                name=name,
                content_type=content_type,
            )

            # Assign or update the groups that have this permission
            for role in roles:
                group, group_created = Group.objects.get_or_create(name=role)
                group.permissions.add(permission)

                if group_created:
                    print(f"Group created: {group.name}")
                print(f"Assigned {perm_type} permission for {model_name} to {role}")

            if created:
                print(f"Permission created: {permission.name}")

# Run the function to set permissions
set_permissions()
