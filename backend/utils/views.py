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

from apps.campaigns.models import Campaign, CampaignMember
from apps.campaigns.serializers import CampaignMemberSerializer
from apps.auths.serializers import GroupSerializer


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated

from apps.auths.models import User
from apps.campaigns.models import CampaignMember
from apps.auths.serializers import UserSerializer
from apps.campaigns.serializers import  CampaignSerializer



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


def determine_user_role(campaign_id, user_id, context):
    """
    Determines the role of a user within a campaign. 
    Parameters: campaign_id (the identifier of the campaign), user_id (the identifier of the user), and context (for serialization).
    It first checks if the user has admin or superAdmin privileges.
    If not, it attempts to find the user's role within the campaign.
    It returns the user's role within the campaign, "admin" if they have higher privileges, or None otherwise.
    """
    # Check if user is admin or superAdmin first
    if is_higher_privilege(user_id):
        return "admin"

    # Fetch campaign roles
    campaign_roles = Group.objects.filter(Q(category=3))  # Assuming category=3 represents campaign roles
    # Convert campaign_roles to a dictionary for faster lookup
    role_lookup = {role.id: role.name for role in campaign_roles}

    # Get the current campaign member's role
    current_campaign_member = get_current_campaign_member(campaign_id, user_id, context)
    if current_campaign_member:
        return role_lookup.get(current_campaign_member.get('role'))

    # Return None if user is neither admin nor part of the campaign
    return None

def is_higher_privilege(user_id):
    """
    Checks if a user has higher privileges ("admin" or "superAdmin")
    It directly filters the User model and returns True if the user has higher privileges, otherwise False.
    """    
    return User.objects.filter(pk=user_id, groups__name__in=["admin", "superAdmin"]).exists()

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
    print("current_campaign_member_query", current_campaign_member) #OK

    if current_campaign_member:
        return CampaignMemberSerializer(current_campaign_member, context=context).data
    return None



# CAMPAIGNS MEMBERS
def get_campaign_members_by_role(campaign, user_role, current_campaign_member):
    MANAGER_ROLES = {"admin", "campaignModerator", "campaignCandidate", "campaignCoordinator"}
    SUPERVISOR_ROLES = {"campaignSupervisor"}

    if user_role in MANAGER_ROLES:
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



# Mezzanine
def is_editable(obj, request):
    """
    Returns ``True`` if the object is editable for the request. First
    check for a custom ``editable`` handler on the object, otherwise
    use the logged in user and check change permissions for the
    object's model.
    """
    if hasattr(obj, "is_editable"):
        return obj.is_editable(request)
    else:
        codename = get_permission_codename("change", obj._meta)
        perm = f"{obj._meta.app_label}.{codename}"
        return (
            is_authenticated(request.user)
            and has_site_permission(request.user)
            and request.user.has_perm(perm)
        )


def ip_for_request(request):
    """
    Returns ip address for request - first checks ``HTTP_X_FORWARDED_FOR``
    header, since app will generally be behind a public web server.
    """
    meta = request.META
    return meta.get("HTTP_X_FORWARDED_FOR", meta["REMOTE_ADDR"]).split(",")[0]


def is_spam_akismet(request, form, url):
    """
    Identifies form data as being spam, using the http://akismet.com
    service. The Akismet API key should be specified in the
    ``AKISMET_API_KEY`` setting. This function is the default spam
    handler defined in the ``SPAM_FILTERS`` setting.

    The name, email, url and comment fields are all guessed from the
    form fields:

    * name: First field labelled "Name", also taking i18n into account.
    * email: First ``EmailField`` field.
    * url: First ``URLField`` field.
    * comment: First field with a ``Textarea`` widget.

    If the actual comment can't be extracted, spam checking is passed.

    The referrer field expects a hidden form field to pass the referrer
    through, since the HTTP_REFERER will be the URL the form is posted
    from. The hidden referrer field is made available by default with
    the ``{% fields_for %}`` templatetag used for rendering form fields.
    """
    if not settings.AKISMET_API_KEY:
        return False
    protocol = "http" if not request.is_secure() else "https"
    host = protocol + "://" + request.get_host()
    data = {
        "blog": host,
        "user_ip": ip_for_request(request),
        "user_agent": request.META.get("HTTP_USER_AGENT", ""),
        "referrer": request.POST.get("referrer", ""),
        "permalink": host + url,
        "comment_type": "comment" if "comment" in request.POST else "form",
    }
    for name, field in form.fields.items():
        data_field = None
        if field.label and field.label.lower() in ("name", _("Name").lower()):
            data_field = "comment_author"
        elif isinstance(field, EmailField):
            data_field = "comment_author_email"
        elif isinstance(field, URLField):
            data_field = "comment_author_url"
        elif isinstance(field.widget, Textarea):
            data_field = "comment_content"
        if data_field and not data.get(data_field):
            cleaned_data = form.cleaned_data.get(name)
            try:
                data[data_field] = cleaned_data.encode("utf-8")
            except UnicodeEncodeError:
                data[data_field] = cleaned_data
    if not data.get("comment_content"):
        return False
    api_url = "http://%s.rest.akismet.com/1.1/comment-check" % settings.AKISMET_API_KEY
    versions = (django.get_version(), mezzanine.__version__)
    headers = {"User-Agent": "Django/%s | Mezzanine/%s" % versions}
    try:
        response = urlopen(
            Request(api_url, urlencode(data).encode("utf-8"), headers)
        ).read()
    except Exception:
        return False

    # Python 3 returns response as a bytestring, Python 2 as a regular str
    return response in (b"true", "true")


def is_spam(request, form, url):
    """
    Main entry point for spam handling - called from the comment view and
    page processor for ``mezzanine.forms``, to check if posted content is
    spam. Spam filters are configured via the ``SPAM_FILTERS`` setting.
    """
    for spam_filter_path in settings.SPAM_FILTERS:
        spam_filter = import_dotted_path(spam_filter_path)
        if spam_filter(request, form, url):
            return True


def paginate(objects, page_num, per_page, max_paging_links):
    """
    Return a paginated page for the given objects, giving it a custom
    ``visible_page_range`` attribute calculated from ``max_paging_links``.
    """
    if not per_page:
        return Paginator(objects, 0)
    paginator = Paginator(objects, per_page)
    try:
        page_num = int(page_num)
    except ValueError:
        page_num = 1
    try:
        objects = paginator.page(page_num)
    except (EmptyPage, InvalidPage):
        objects = paginator.page(paginator.num_pages)
    page_range = objects.paginator.page_range
    if len(page_range) > max_paging_links:
        start = min(
            objects.paginator.num_pages - max_paging_links,
            max(0, objects.number - (max_paging_links // 2) - 1),
        )
        page_range = list(page_range)[start : start + max_paging_links]
    objects.visible_page_range = page_range
    return objects


def render(request, templates, dictionary=None, context_instance=None, **kwargs):
    """
    Mimics ``django.shortcuts.render`` but uses a TemplateResponse for
    ``mezzanine.core.middleware.TemplateForDeviceMiddleware``
    """

    warnings.warn(
        "mezzanine.utils.views.render is deprecated and will be removed "
        "in a future version. Please update your project to use Django's "
        "TemplateResponse, which now provides equivalent functionality.",
        DeprecationWarning,
    )

    dictionary = dictionary or {}
    if context_instance:
        context_instance.update(dictionary)
    else:
        context_instance = RequestContext(request, dictionary)
    return TemplateResponse(request, templates, context_instance, **kwargs)


def set_cookie(response, name, value, expiry_seconds=None, secure=False):
    """
    Set cookie wrapper that allows number of seconds to be given as the
    expiry time, and ensures values are correctly encoded.
    """
    if expiry_seconds is None:
        expiry_seconds = 90 * 24 * 60 * 60  # Default to 90 days.
    expires = datetime.strftime(
        datetime.utcnow() + timedelta(seconds=expiry_seconds),
        "%a, %d-%b-%Y %H:%M:%S GMT",
    )
    # Django doesn't seem to support unicode cookie keys correctly on
    # Python 2. Work around by encoding it. See
    # https://code.djangoproject.com/ticket/19802
    try:
        response.set_cookie(name, value, expires=expires, secure=secure)
    except (KeyError, TypeError):
        response.set_cookie(name.encode("utf-8"), value, expires=expires, secure=secure)
