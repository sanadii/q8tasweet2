import warnings
from datetime import datetime, timedelta
from urllib.parse import urlencode
from urllib.request import Request, urlopen

import django
from django.contrib.auth import get_permission_codename
from django.core.paginator import EmptyPage, InvalidPage, Paginator
from django.forms import EmailField, Textarea, URLField
from django.template import RequestContext
from django.template.response import TemplateResponse
from django.utils.translation import gettext as _

# import mezzanine
# from mezzanine.conf import settings
# from utils.deprecation import is_authenticated
# from utils.importing import import_dotted_path
# from utils.sites import has_site_permission
from apps.auths.models import Group, User
from django.db.models import Q

from apps.campaigns.models import Campaign
from apps.campaigns.members.models import CampaignMember
# from apps.campaigns.models import Campaign, CampaignParty, CampaignMember, CampaignPartyMember
from apps.campaigns.members.serializers import CampaignMemberSerializer
from apps.auths.serializers import GroupSerializer


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated

from apps.auths.models import User
# from apps.campaigns.models import CampaignMember
from apps.auths.serializers import UserSerializer
# from apps.campaigns.serializers import  CampaignSerializer


def get_campaign_roles(context):
    """
    Retrieves a list of campaign roles from the database,
    which are specifically roles categorized as "CampaignRoles".
    It returns these roles as serialized data using the GroupSerializer.
    The context parameter is provided to ensure proper serialization.
    Status: Working fine
    """

    campaign_roles = Group.objects.filter(Q(category=3))  # CampaignRoles
    return GroupSerializer(campaign_roles, many=True, context=context).data


def determine_user_role(campaign_id, user_id, campaign_roles, context):
    """
    Determines the role of a user within a campaign or if has higher privilege. 
    Parameters: campaign_id (the identifier of the campaign), user_id (the identifier of the user), and context (for serialization).
    It first checks if the user has admin or superAdmin privileges.
    If not, it attempts to find the user's role within the campaign.
    It returns the user's role within the campaign, "admin" if they have higher privileges, or None otherwise.
    """
    # print("determine_user_role: ", "campaign_id: ", campaign_id, "user_id: ", user_id, "context: ", context)

    # Check if user is admin or superAdmin first
    if is_higher_privilege(user_id):
        return "higherPrivilage"
    print("campaign_rolescampaign_roles: ", campaign_roles)
    # Convert campaign_roles to a dictionary for faster lookup
    # role_lookup = {id: role.id for role in campaign_roles}
    # print("role_lookup: ", role_lookup)


    # Get the current campaign member's role
    current_campaign_member = get_current_campaign_member(campaign_id, user_id, context)
    if current_campaign_member:
        return current_campaign_member.get('role_codename')

    # Return None if user is neither admin nor part of the campaign
    return None


def is_higher_privilege(user_id):
    """
    Checks if a user has higher privileges ("admin" or "superAdmin")
    It directly filters the User model and returns True if the user has higher privileges, otherwise False.
    """    
    return User.objects.filter(pk=user_id, groups__codename__in=["admin", "superAdmin"]).exists()


def get_current_campaign_member(campaign_id, user_id, context):
    """
    Retrieves a list of the current campaign's member.
    Identified by both campaign_id and user_id.
    It fetches campaign members from the database and serializes it using CampaignMemberSerializer.
    If the campaign member is found, it returns the serialized data; otherwise, it returns None.
    """
    current_campaign_member = CampaignMember.objects.select_related('user').filter(
        campaign_id=campaign_id, user_id=user_id
        ).first()
    # print("current_campaign_member_query", current_campaign_member) #OK

    if current_campaign_member:
        return CampaignMemberSerializer(current_campaign_member, context=context).data
    return None

# CAMPAIGNS MEMBERS
def get_campaign_members_by_role(campaign, user_role, current_campaign_member):
    HIGHER_PRIVILAGE_ROLES = {"higherPrivilage"}
    MANAGER_ROLES = {"campaignModerator", "campaignCandidate", "partyAdmin", "CampaignAdmin"}
    SUPERVISOR_ROLES = {"CampaignFieldAdmin", "CampaignDigitalAdmin", "CampaignFieldAgent", "CampaignDigitalAgent"}
    print("get_campaign_members_by_role: ", "campaign: ", campaign, "user_role: ", user_role, "current_campaign_member: ", current_campaign_member)

    if user_role in HIGHER_PRIVILAGE_ROLES:
        campaign_members = CampaignMember.objects.filter(campaign=campaign)
        campaign_managed_members = campaign_members  # For these roles, all campaign members are considered "managed"
        print("campaign_members XXX: ", campaign_members)

    elif user_role in MANAGER_ROLES:
        campaign_members = CampaignMember.objects.filter(campaign=campaign)
        campaign_managed_members = campaign_members  # For these roles, all campaign members are considered "managed"
        print("campaign_members XXX: ", campaign_members)

    elif user_role in SUPERVISOR_ROLES:
        campaign_managers = get_campaign_managers(campaign)
        campaign_managed_members = get_campaign_managed_members(current_campaign_member, user_role)
        campaign_members = campaign_managers | campaign_managed_members

    else:
        campaign_managed_members = CampaignMember.objects.none()
        campaign_members = campaign_managed_members
    
    return campaign_members, campaign_managed_members


def get_campaign_managed_members(current_campaign_member, user_role):
    """Get members managed by the given supervisor."""
    campaign_member_id = current_campaign_member.get('id')
    current_campaign_member = CampaignMember.objects.filter(id=campaign_member_id)

    # if supervisor, get the member managed by supervisor together with current member (supervisor)
    if user_role == "campaignSupervisor":
        campaign_supervised_members = CampaignMember.objects.filter(supervisor_id=campaign_member_id)
        campaign_managed_members = current_campaign_member | campaign_supervised_members
    else:
        campaign_managed_members = current_campaign_member

    return campaign_managed_members


def get_campaign_managers(campaign):
    """Get members with managerial roles in the campaign."""
    
    # Define the roles for campaign managers
    manager_roles = ["campaignModerator", "campaignCandidate", "campaignCoordinator" ]
    
    campaign_managers = CampaignMember.objects.select_related('role').filter(
        campaign=campaign,
        role__name__in=manager_roles
    )
    
    return campaign_managers