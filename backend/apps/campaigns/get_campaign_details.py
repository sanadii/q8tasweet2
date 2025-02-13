# from apps.campaigns.models import Campaign
from rest_framework.response import Response

# Apps Models
from apps.schemas.guarantees.models import CampaignGuarantee, CampaignGuaranteeGroup
from apps.schemas.campaign_attendees.models import CampaignAttendee
from apps.schemas.committees.models import CommitteeSite, Committee

# Apps Serializers
from apps.schemas.campaign_attendees.serializers import CampaignAttendeeSerializer
from apps.schemas.guarantees.serializers import (
    CampaignGuaranteeSerializer,
    CampaignGuaranteeGroupSerializer,
)


from apps.schemas.committees.serializers import CommitteeSiteSerializer

# Apps Utils
from utils.schema import schema_context


def get_committee_sites(context, response_data):
    try:
        election_committee_sites = CommitteeSite.objects.prefetch_related(
            "committee_site_committees"
        ).all()
        response_data["election_committee_sites"] = CommitteeSiteSerializer(
            election_committee_sites, many=True, context=context
        ).data
    except Exception as e:
        response_data["committeeDataError"] = str(e)


def get_campaign_guarantee_groups(context, campaign_managed_members, response_data):
    try:
        campaign_guarantee_groups = CampaignGuaranteeGroup.objects.filter(
            member__in=campaign_managed_members.values_list("id", flat=True)
        )
        response_data["campaign_guarantee_groups"] = CampaignGuaranteeGroupSerializer(
            campaign_guarantee_groups, many=True, context=context
        ).data
    except Exception as e:
        response_data["campaignGuaranteeGroupDataError"] = str(e)


def get_campaign_guarantees(
    context, current_campaign_member, campaign_managed_members, response_data
):
    try:
        # Check if the current campaign member is a "campaignFieldAgent"
        current_campaign_member_role = current_campaign_member["role_codename"]

        campaign_guarantee_by_gender = []
        if current_campaign_member_role == "campaignFieldAgent":
            # Get the gender of the committee site
            if current_campaign_member["committee_sites"]:
                current_campaign_member_committee_site_gender = current_campaign_member[
                    "committee_sites"
                ][0]["gender"]

                campaign_guarantee_by_gender = CampaignGuarantee.objects.filter(
                    elector_id__gender=current_campaign_member_committee_site_gender
                )

        # Fetch campaign guarantees for the managed members
        campaign_guarantees = CampaignGuarantee.objects.filter(
            member__in=campaign_managed_members.values_list("id", flat=True)
        )

        # Combine the two lists with no repetition
        combined_campaign_guarantees = list(
            set(campaign_guarantees) | set(campaign_guarantee_by_gender)
        )

        response_data["campaign_guarantees"] = CampaignGuaranteeSerializer(
            combined_campaign_guarantees, many=True, context=context
        ).data
    except Exception as e:
        response_data["campaignGuaranteeDataError"] = str(e)


def get_campaign_attendees(
    context, current_campaign_member, campaign_managed_members, response_data
):
    try:
        current_campaign_member_role = current_campaign_member.get("role_codename")

        campaign_attendees = []

        if current_campaign_member_role in [
            "campaignFieldDelegate",
            "campaignFieldAgent",
        ]:
            # Get the gender of the committee site
            if current_campaign_member.get("committee"):
                committee_info = current_campaign_member["committee"]
                committee_id = (
                    committee_info["id"]
                    if isinstance(committee_info, dict)
                    else committee_info
                )
                committee = Committee.objects.get(id=committee_id)
                committee_site_gender = committee.committee_site.gender

                campaign_attendees_by_gender = CampaignAttendee.objects.filter(
                    elector_id__gender=committee_site_gender
                )
                campaign_attendees = list(campaign_attendees_by_gender)
        else:
            campaign_attendees_managed = CampaignAttendee.objects.filter(
                member__in=campaign_managed_members.values_list("id", flat=True)
            )
            campaign_attendees = list(campaign_attendees_managed)

        response_data["campaign_attendees"] = CampaignAttendeeSerializer(
            campaign_attendees, many=True, context=context
        ).data
    except Exception as e:
        response_data["campaignAttendeeDataError"] = str(e)


def get_campaign_details(
    context,
    election_slug,
    campaign,
    current_campaign_member,
    campaign_managed_members,
    response_data,
):
    print("contextcontext: ", context)

    if not isinstance(response_data, dict):
        response_data = {}

    with schema_context(election_slug):
        get_committee_sites(context, response_data)
        get_campaign_guarantee_groups(context, campaign_managed_members, response_data)
        get_campaign_guarantees(
            context, current_campaign_member, campaign_managed_members, response_data
        )
        get_campaign_attendees(
            context, current_campaign_member, campaign_managed_members, response_data
        )

    return Response(response_data)
