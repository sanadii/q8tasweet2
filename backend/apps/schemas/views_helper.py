# from apps.campaigns.models import Campaign
# Apps
from apps.schemas.schema import schema_context

# Serializers
from apps.elections.candidates.models import ElectionCandidate, ElectionParty


class AccessElectionSchemaMixin:
    """Mixin to handle accessing the election schema and related objects."""

    def get_related_object(self, campaign):
        """Retrieve the related election object based on campaign type."""
        if campaign.campaign_type and campaign.campaigner_id:
            if campaign.campaign_type.model == "candidate":
                return ElectionCandidate.objects.get(id=campaign.campaigner_id)
            elif campaign.campaign_type.model == "party":
                return ElectionParty.objects.get(id=campaign.campaigner_id)
            else:
                raise ValueError(
                    f"Invalid campaign_type: {campaign.campaign_type.model}"
                )
        else:
            raise ValueError(
                "Campaign object is missing campaign_type or campaigner_id"
            )

    def get_election_schema(self, request):
        """Get the election schema slug for the campaign."""
        schema_slug = self.kwargs.get("schema")
        if not schema_slug:
            raise ValueError("Schema slug is missing from URL")
        return schema_slug

    def get_campaign_election_schema(self, request):
        """Get the election schema slug for the campaign."""
        schema_slug = self.kwargs.get("schema")
        if not schema_slug:
            raise ValueError("Schema slug is missing from URL")
        return schema_slug

    def execute_with_schema(self, request, view_func, *args, **kwargs):
        """Execute the view function within the schema context."""
        schema = self.get_campaign_election_schema(request)
        print("schemaschemaschema123: ", schema)
        with schema_context(schema):
            if hasattr(request, "response"):
                return request.response
            return view_func(request, *args, **kwargs)

