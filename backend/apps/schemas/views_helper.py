# from apps.campaigns.models import Campaign
# Apps
from apps.schemas.schema import schema_context

# Serializers
from apps.schemas.areas.models import Area
from apps.elections.models import Election
from apps.schemas.committees.models import Committee, CommitteeSite
from apps.schemas.committee_results.models import (
    CommitteeResultCandidate,
    CommitteeResultParty,
    CommitteeResultPartyCandidate,
)
from apps.schemas.committee_members.models import MemberCommitteeSite, MemberCommittee
from apps.schemas.electors.models import Elector
from apps.schemas.guarantees.models import CampaignGuarantee, CampaignGuaranteeGroup
from apps.schemas.campaign_attendees.models import CampaignAttendee
from apps.schemas.campaign_sorting.models import SortingCampaign, SortingElection

from utils.schema import schema_context, table_exists

class AccessElectionSchemaMixin:
    """Mixin to handle accessing the election schema and related objects."""

    def get_campaign_election_schema(self, request):
        """Get the election schema slug for the campaign."""
        schema_slug = self.kwargs.get("schema")
        if not schema_slug:
            raise ValueError("Schema slug is missing from URL")
        return schema_slug

    def execute_with_schema(self, request, view_func, *args, **kwargs):
        """Execute the view function within the schema context."""
        schema = self.get_campaign_election_schema(request)
        with schema_context(schema):
            if hasattr(request, "response"):
                return request.response
            return view_func(request, *args, **kwargs)


def get_election(slug):
    try:
        return Election.objects.get(slug=slug)
    except Election.DoesNotExist:
        return None
        
def get_schema_models_to_add(election):
    models = [Area, Committee,  CommitteeSite,  Elector]
    
    election_method = election.election_method
    is_detailed_results = election.is_detailed_results
    is_sorting_results = election.is_sorting_results

    if is_detailed_results:
        if election_method in ["candidateOnly", "partyCandidateOriented"]:
            models.append(CommitteeResultCandidate)
            # models.append(SortingCampaign)

        if election_method == "partyPartyOriented":
            models.append(CommitteeResultParty)
            
        if election_method == "partyCandidateCombined":
            models.append(CommitteeResultParty)
            models.append(CommitteeResultPartyCandidate)

    if is_sorting_results:
        models.append(SortingCampaign)
        models.append(SortingElection)

    # if has campaigns
    models.extend(
        [
            CampaignGuarantee,
            CampaignGuaranteeGroup,
            MemberCommittee,
            MemberCommitteeSite,
            CampaignAttendee,
        ]
    )

    return models

def create_schema_tables(schema_editor, models):
    results = {}
    for Model in models:
        try:
            table_name = Model._meta.db_table
            if not table_exists(table_name):
                schema_editor.create_model(Model)
                results[table_name] = "Created successfully"
            else:
                results[table_name] = "Table already exists"
        except Exception as e:
            results[Model._meta.model_name] = f"Failed to create table: {str(e)}"
    return results
