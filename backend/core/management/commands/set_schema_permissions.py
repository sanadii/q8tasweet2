# core/management/commands/set_schema_permissions.py

from django.core.management.base import BaseCommand
from django.contrib.auth.models import Permission, ContentType
from django.db.utils import IntegrityError
from django.contrib.contenttypes.models import ContentType

# Define the permissions for each unmanaged model
UNMANAGED_PERMISSIONS = {
    'committee': [
        ('can_view_committee', 'Can view committee'),
        ('can_add_committee', 'Can add committee'),
        ('can_change_committee', 'Can change committee'),
        ('can_delete_committee', 'Can delete committee'),
    ],
    'electioncommittee': [
        ('canViewElectionCommitteeResult', 'Can View Election Committee Result'),
        ('canAddElectionCommitteeResult', 'Can Add Election Committee Result'),
        ('canChangeElectionCommitteeResult', 'Can Change Election Committee Result'),
        ('canDeleteElectionCommitteeResult', 'Can Delete Election Committee Result'),
    ],
    'campaignguaranteegroup': [
        ('canViewCampaignGuaranteeGroup', 'Can View Campaign Guarantee Group'),
        ('canAddCampaignGuaranteeGroup', 'Can Add Campaign Guarantee Group'),
        ('canChangeCampaignGuaranteeGroup', 'Can Change Campaign Guarantee Group'),
        ('canDeleteCampaignGuaranteeGroup', 'Can Delete Campaign Guarantee Group'),
    ],
    'campaignguarantee': [
        ('canViewCampaignGuarantee', 'Can View Campaign Guarantee'),
        ('canAddCampaignGuarantee', 'Can Add Campaign Guarantee'),
        ('canChangeCampaignGuarantee', 'Can Change Campaign Guarantee'),
        ('canDeleteCampaignGuarantee', 'Can Delete Campaign Guarantee'),
    ],
    'campaignsorting': [
        ('canViewCampaignSorting', 'Can View Campaign Sorting'),
        ('canAddCampaignSorting', 'Can Add Campaign Sorting'),
        ('canChangeCampaignSorting', 'Can Change Campaign Sorting'),
        ('canDeleteCampaignSorting', 'Can Delete Campaign Sorting'),
    ],
    'campaigncommitteesorter': [
        ('canViewCampaignCommitteeSorter', 'Can View Campaign Committee Sorter'),
        ('canAddCampaignCommitteeSorter', 'Can Add Campaign Committee Sorter'),
        ('canChangeCampaignCommitteeSorter', 'Can Change Campaign Committee Sorter'),
        ('canDeleteCampaignCommitteeSorter', 'Can Delete Campaign Committee Sorter'),
    ],
    
        #     permissions = [
        #     ("canViewCampaignAttendee", "Can View Election Attendee"),
        #     ("canAddCampaignAttendee", "Can Add Election Attendee"),
        #     ("canChangeCampaignAttendee", "Can Change Election Attendee"),
        #     ("canDeleteCampaignAttendee", "Can Delete Election Attendee"),
        # ]

}

class Command(BaseCommand):
    help = 'Set permissions for unmanaged models'

    def handle(self, *args, **options):
        for model, permissions in UNMANAGED_PERMISSIONS.items():
            content_type, created = ContentType.objects.get_or_create(
                model=model,
                app_label='schemas',
            )
            for codename, name in permissions:
                try:
                    permission, created = Permission.objects.get_or_create(
                        codename=codename,
                        name=name,
                        content_type=content_type,
                    )
                    if created:
                        self.stdout.write(self.style.SUCCESS(f'Created permission: {codename}'))
                    else:
                        self.stdout.write(self.style.WARNING(f'Permission already exists: {codename}'))
                except IntegrityError:
                    self.stdout.write(self.style.ERROR(f'Error creating permission: {codename}'))

        self.stdout.write(self.style.SUCCESS('Permissions set successfully!'))
