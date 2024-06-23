from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group
from .election.import_election_details import import_election_details
from .election.related_candidates import import_election_related_candidates
from .election.related_campaigns import import_election_related_campaigns
from .election.related_members import import_election_related_members
from .election.related_guarantees import import_election_related_guarantees

class Command(BaseCommand):
    help = "Import election details and related data"

    def add_arguments(self, parser):
        parser.add_argument("election", type=str, help="Election identifier")


    def handle(self, *args, **options):
        file_name = options["election"]
        file_path = f"core/management/data/{file_name}.xlsx"

        first_campaign = 3
        campaign_members = import_election_related_members(file_name, file_path, first_campaign, self)

        first_campaign_member = 3
        campaign_guarantee_groups = import_election_related_guarantees(file_name, file_path, first_campaign_member, self)
        self.stdout.write(self.style.SUCCESS(f"Created/Updated {len(campaign_guarantee_groups)} CampaignGuaranteeGroups."))
            # self.stdout.write(self.style.SUCCESS(f"Created/Updated {len(campaign_guarantees)} CampaignGuarantees."))
