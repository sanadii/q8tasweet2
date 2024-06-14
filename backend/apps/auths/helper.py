from apps.campaigns.models import Campaign
from apps.campaigns.serializers import CampaignSerializer

def get_current_user_campaigns( user):
    """
    Retrieve a list of campaigns for the current User
    if the user is Admin, SuperAdmin = get favorite
    if the user is Not Admin = get all related campaigns
    """
    if not user.is_staff:
        campaign_objects = Campaign.objects.filter(
            campaign_members__user=user
        ).distinct()  # Get campaign objects for the user
        serializer = CampaignSerializer(campaign_objects, many=True)
        return serializer.data
    else:
        # User is staff, get all campaigns
        all_campaigns = Campaign.objects.all()
        serializer = CampaignSerializer(all_campaigns, many=True)
        return serializer.data
