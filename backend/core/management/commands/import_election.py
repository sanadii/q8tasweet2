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

    def list_all_groups(self):
        groups = Group.objects.all()
        for group in groups:
            self.stdout.write(f"Group ID: {group.id}, Group Name: {group.name}")

    def handle(self, *args, **options):
        file_name = options["election"]
        file_path = f"core/management/data/{file_name}.xlsx"

        self.stdout.write(self.style.SUCCESS("Listing all groups..."))
        self.list_all_groups()

        election_object = import_election_details(file_name, file_path, self)
        if not election_object:
            self.stdout.write(self.style.ERROR("Election details import failed."))
            return

        election_id = election_object.id
        
        election_candidates = import_election_related_candidates(file_name, file_path, election_id, self)
        election_campaigns = import_election_related_campaigns(file_name, file_path, self)
        
        if election_campaigns:
            first_campaign = election_campaigns[0]
            campaign_members = import_election_related_members(file_name, file_path, first_campaign, self)
            if campaign_members:
                first_member = campaign_members[0]
                campaign_guarantee_groups = import_election_related_guarantees(file_name, file_path, first_member, self)
                self.stdout.write(self.style.SUCCESS(f"Created/Updated {len(campaign_guarantee_groups)} CampaignGuaranteeGroups."))
                # self.stdout.write(self.style.SUCCESS(f"Created/Updated {len(campaign_guarantees)} CampaignGuarantees."))
            else:
                self.stdout.write(self.style.WARNING("No campaign members found to create guarantees."))
            self.stdout.write(self.style.SUCCESS(f"Created/Updated {len(campaign_members)} CampaignMembers."))
        else:
            self.stdout.write(self.style.WARNING("No campaigns found to create members."))

        self.stdout.write(self.style.SUCCESS(f"Created/Updated {len(election_candidates)} ElectionCandidates."))
        self.stdout.write(self.style.SUCCESS(f"Created {len(election_campaigns)} Campaigns."))
        
        self.stdout.write(self.style.SUCCESS("Setup Q8tasweet command completed successfully."))
        self.stdout.write(self.style.SUCCESS(f"ElectionCandidates: {election_candidates}"))
        self.stdout.write(self.style.SUCCESS(f"Campaigns: {election_campaigns}"))
