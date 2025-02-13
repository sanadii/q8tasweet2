from rest_framework import serializers

# Apps
from apps.campaigns.members.models import CampaignMember
from apps.elections.candidates.models import ElectionCandidate, ElectionParty
from apps.schemas.committees.models import CommitteeSite, Committee
from apps.schemas.committee_members.models import MemberCommitteeSite, MemberCommittee
from apps.schemas.committees.serializers import CommitteeSiteSerializer, CommitteeSerializer
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

    def get_committee_sites(self, obj):
        election_slug = obj.campaign.election_candidate.election.slug
        
        with schema_context(election_slug):
            try:
                # Query MemberCommitteeSite to get related CommitteeSite objects
                committee_sites = MemberCommitteeSite.objects.filter(member=obj.id)

                serialized_committees = [
                    CommitteeSiteSerializer(committee_site.committee_site).data
                    for committee_site in committee_sites
                ]
                
                print("obj.id: ", obj.id )

                return serialized_committees
            except Exception as e:
                print("Error:", e)
                return []

    def get_committee(self, obj):
        election_slug = obj.campaign.election_candidate.election.slug
        with schema_context(election_slug):
            try:
                # Query MemberCommittee to get the related MemberCommittee object
                committee_member = MemberCommittee.objects.filter(member=obj.id).first()
                if committee_member:
                    committee = committee_member.committee
                    return CommitteeSerializer(committee).data
                return None
            except MemberCommittee.DoesNotExist:
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
        
        # Get the dynamic schema from the object or request
        election_slug = self.instance.campaign.election_candidate.election.slug

        with schema_context(election_slug):
            # Handle committee_site_ids
            if committee_site_ids:
                try:
                    for site_id in committee_site_ids:
                        # Retrieve the CommitteeSite object
                        committee_site = CommitteeSite.objects.get(id=site_id)

                        # Create or update MemberCommitteeSite with the CampaignMember instance's ID
                        MemberCommitteeSite.objects.update_or_create(
                            member=self.instance.id,
                            committee_site=committee_site,
                            defaults={'committee_site': committee_site}
                        )
                        print(f"MemberCommitteeSite for site {site_id} created or updated successfully")
                except CommitteeSite.DoesNotExist:
                    print(f"CommitteeSite with id {site_id} does not exist")
                    raise serializers.ValidationError(f"CommitteeSite with id {site_id} does not exist")
                except Exception as e:
                    print(f"Unexpected error occurred: {e}")
                    raise serializers.ValidationError(f"Unexpected error: {e}")
            else:
                # If no committee_site_ids, remove all MemberCommitteeSite entries related to the member
                MemberCommitteeSite.objects.filter(member=self.instance.id).delete()
                print("All MemberCommitteeSite entries related to the member have been deleted")

            # Handle committee_id
            if committee_id:
                try:
                    # Retrieve the Committee object
                    committee = Committee.objects.get(id=committee_id)

                    # Create or update MemberCommittee with the CampaignMember instance's ID
                    MemberCommittee.objects.update_or_create(
                        member=self.instance.id, defaults={"committee": committee}
                    )
                    print("MemberCommittee created or updated successfully")
                except Committee.DoesNotExist:
                    print(f"Committee with id {committee_id} does not exist")
                    raise serializers.ValidationError(
                        f"Committee with id {committee_id} does not exist"
                    )
                except Exception as e:
                    print(f"Unexpected error occurred: {e}")
                    raise serializers.ValidationError(f"Unexpected error: {e}")
            else:
                # If no committee_id, remove the MemberCommittee entry related to the member
                MemberCommittee.objects.filter(member=self.instance.id).delete()
                print("MemberCommittee entry related to the member has been deleted")
