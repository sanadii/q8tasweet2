from rest_framework import serializers
from rest_framework.response import Response

# Apps
from apps.campaigns.members.models import CampaignMember
from apps.elections.candidates.models import ElectionCandidate, ElectionParty
from apps.schemas.committees.models import CommitteeSite, Committee
from apps.schemas.committee_members.models import CommitteeSiteMember, CommitteeMember
from apps.schemas.committees.serializers import (
    CommitteeSiteSerializer,
    CommitteeSerializer,
)
from utils.schema import schema_context


class CampaignMemberSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    permissions = serializers.SerializerMethodField()
    role_id = serializers.SerializerMethodField()
    role_name = serializers.SerializerMethodField()
    role_codename = serializers.SerializerMethodField()
    committee_sites = serializers.SerializerMethodField()
    committee = serializers.SerializerMethodField()

    class Meta:
        model = CampaignMember
        fields = "__all__"  # Or specify required fields

    def get_name(self, obj):
        if obj.user:
            return f"{obj.user.first_name} {obj.user.last_name}"
        return "User not found"

    def get_permissions(self, obj):
        if obj.role:
            campaign_member_permissions = list(
                obj.role.permissions.values_list("codename", flat=True)
            )
            return campaign_member_permissions
        return []

    def get_role_attribute(self, obj, attribute):
        if obj.role:
            return getattr(obj.role, attribute, "Attribute not found")
        return "Group not found"

    def get_role_id(self, obj):
        return self.get_role_attribute(obj, "id")

    def get_role_name(self, obj):
        return self.get_role_attribute(obj, "name")

    def get_role_codename(self, obj):
        return self.get_role_attribute(obj, "codename")

    def get_campaign_related_object(self, obj):
        """Helper function to retrieve the related ElectionCandidate or ElectionParty object based on campaign_type."""
        if obj.campaign_type and obj.campaigner_id:
            if obj.campaign_type.model == "candidate":
                return ElectionCandidate.objects.get(id=obj.campaigner_id)
            elif obj.campaign_type.model == "party":
                return ElectionParty.objects.get(id=obj.campaigner_id)
            else:
                raise ValueError(f"Invalid campaign_type: {obj.campaign_type.model}")
        else:
            raise ValueError(
                "Campaign object is missing campaign_type or campaigner_id"
            )

    def get_election_slug(self, obj):
        campaign = obj.campaign
        related_object = self.get_campaign_related_object(campaign)
        election_slug = related_object.election.slug

        return election_slug

    def get_committee_sites(self, obj):
        election_slug = self.get_election_slug(obj)
        with schema_context(election_slug):
            try:
                # Query CommitteeSiteMember to get related CommitteeSite objects
                committee_sites = CommitteeSiteMember.objects.filter(member=obj.id)
                serialized_committees = [
                    CommitteeSiteSerializer(committee_site.committee_site).data
                    for committee_site in committee_sites
                ]
                return serialized_committees
            except Exception as e:
                print("Error:", e)
                return []

    def get_committee(self, obj):
        election_slug = self.get_election_slug(obj)
        with schema_context(election_slug):
            try:
                # Query CommitteeMember to get the related CommitteeMember object
                committee_member = CommitteeMember.objects.filter(member=obj.id).first()
                if committee_member:
                    committee = committee_member.committee
                    return CommitteeSerializer(committee).data
                return None
            except CommitteeMember.DoesNotExist:
                return None
            except Exception as e:
                print("Error:", e)
                return None


    def save(self, **kwargs):
        # Call the original save method to save CampaignMember instance
        super().save(**kwargs)

        # Get the committee_site from the context or request data
        committee_site_ids = self.context['request'].data.get('committee_sites')
        committee_id = self.context["request"].data.get("committee")

        if committee_site_ids:
            # Get the dynamic schema from the object or request
            election_slug = self.get_election_slug(self.instance)

            with schema_context(election_slug):
                try:
                    for site_id in committee_site_ids:
                        # Retrieve the CommitteeSite object
                        committee_site = CommitteeSite.objects.get(id=site_id)

                        # Create or update CommitteeSiteMember with the CampaignMember instance's ID
                        CommitteeSiteMember.objects.update_or_create(
                            member=self.instance.id,
                            committee_site=committee_site,
                            defaults={'committee_site': committee_site}
                        )
                        print(f"CommitteeSiteMember for site {site_id} created or updated successfully")
                except CommitteeSite.DoesNotExist:
                    print(f"CommitteeSite with id {site_id} does not exist")
                    raise serializers.ValidationError(f"CommitteeSite with id {site_id} does not exist")
                except Exception as e:
                    print(f"Unexpected error occurred: {e}")
                    raise serializers.ValidationError(f"Unexpected error: {e}")

        if committee_id:
            # Get the dynamic schema from the object or request
            election_slug = self.get_election_slug(self.instance)

            with schema_context(election_slug):
                try:
                    # Retrieve the Committee object
                    committee = Committee.objects.get(id=committee_id)

                    # Create or update CommitteeMember with the CampaignMember instance's ID
                    CommitteeMember.objects.update_or_create(
                        member=self.instance.id, defaults={"committee": committee}
                    )
                    print("CommitteeMember created or updated successfully")
                except Committee.DoesNotExist:
                    print(f"Committee with id {committee_id} does not exist")
                    raise serializers.ValidationError(
                        f"Committee with id {committee_id} does not exist"
                    )
                except Exception as e:
                    print(f"Unexpected error occurred: {e}")
                    raise serializers.ValidationError(f"Unexpected error: {e}")

    # def save(self, **kwargs):
    #     # Call the original save method to save CampaignMember instance
    #     super().save(**kwargs)

    #     # Get the committee_site from the context or request data
    #     committee_site_id = self.context['request'].data.get('committee_site')

    #     if committee_site_id:
    #         # Get the dynamic schema from the object or request
    #         election_slug = self.get_election_slug(self.instance)

    #         with schema_context(election_slug):
    #             try:
    #                 # Retrieve the CommitteeSite object
    #                 committee_site = CommitteeSite.objects.get(id=committee_site_id)

    #                 # Create or update CommitteeSiteMember with the CampaignMember instance's ID
    #                 CommitteeSiteMember.objects.update_or_create(
    #                     member=self.instance.id,
    #                     defaults={'committee_site': committee_site}
    #                 )
    #                 print("CommitteeSiteMember created or updated successfully")
    #             except CommitteeSite.DoesNotExist:
    #                 print(f"CommitteeSite with id {committee_site_id} does not exist")
    #                 raise serializers.ValidationError(f"CommitteeSite with id {committee_site_id} does not exist")
    #             except Exception as e:
    #                 print(f"Unexpected error occurred: {e}")
    #                 raise serializers.ValidationError(f"Unexpected error: {e}")
