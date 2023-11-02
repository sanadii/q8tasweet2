# campaigns/serializers.py
from rest_framework import serializers
from helper.base_serializer import TrackMixin, TaskMixin, AdminFieldMixin

# Models
from models import Campaign, CampaignMember, CampaignGuarantee, CampaignAttendee
from apps.elections.models import Election, ElectionCandidate, ElectionCommittee
from apps.candidates.models import Candidate
from electors.models import Elector
from apps.categories.models import Category

# Serializers
from candidates.serializers import CandidateSerializer
from elections.serializers import ElectionSerializer
from apps.auths.serializers import UserSerializer

class CampaignSerializer(AdminFieldMixin, serializers.ModelSerializer):
    """ Serializer for the Campaign model. """
    admin_serializer_classes = (TrackMixin, TaskMixin)
    candidate = CandidateSerializer(source='election_candidate.candidate', read_only=True)
    election = ElectionSerializer(source='election_candidate.election', read_only=True)
    
    class Meta: 
        model = Campaign
        fields = [
            "id", "election_candidate", "election", "candidate",
            "description", "target_votes",
            "twitter", "instagram", "website",
            ]
        
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        
        # Remove unwanted fields from nested serializers
        if "election" in rep:
            rep["election"].pop("track", None)
            rep["election"].pop("task", None)
        
        if "candidate" in rep:
            rep["candidate"].pop("track", None)
            rep["candidate"].pop("task", None)

        return rep

class CampaignDetailsSerializer(AdminFieldMixin, serializers.ModelSerializer):

    def get_elections_candidates(self):
        from ..serializers import ElectionSerializer, CandidateSerializer

        election = ElectionSerializer(read_only=True)
        candidate = CandidateSerializer(read_only=True)
        user = UserSerializer(read_only=True)  # Assuming the user field name is 'user'
        # image = serializers.ImageField(use_url=True)  # Ensure the image's URL is returned, not its data

    class Meta:
        model = ElectionCandidate
        fields = [ "id", "votes", "deleted", "election", "candidate"]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["candidate_id"] = instance.candidate_id
        representation["name"] = instance.candidate.name
        representation["image"] = (
            instance.candidate.image.url if instance.candidate.image else None
        )
        representation["gender"] = instance.candidate.gender
        representation["Candidate_deleted"] = instance.candidate.deleted
        return representation


class CampaignElectionSerializer(AdminFieldMixin, serializers.ModelSerializer):
    class Meta:
        model = Election
        fields = "__all__"

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return {"election_" + key: value for key, value in representation.items()}


class campaignCandidateSerializer(AdminFieldMixin, serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = "__all__"

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return {"candidate_" + key: value for key, value in representation.items()}



class CampaignMemberSerializer(AdminFieldMixin, serializers.ModelSerializer):
    from apps.auths.serializers import UserSerializer
    user_details = UserSerializer(source='user', read_only=True)  # Nested User serializer

    class Meta:
        model = CampaignMember
        fields = ["id", "user", "user_details", "campaign", "role", "supervisor", "committee", "notes", "phone", "status"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        current_user_id = self.context.get('current_user_id')

        if instance.user_id == current_user_id:
            user = instance.user
            data['fullName'] = f"{user.first_name} {user.last_name}"

        return data
    from apps.auths.serializers import UserSerializer
    user_details = UserSerializer(source='user', read_only=True)  # Nested User serializer

    class Meta:
        model = CampaignMember
        fields = ["id", "user", "user_details", "campaign", "role", "supervisor", "committee", "notes", "phone", "status"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        current_user_id = self.context.get('current_user_id')

        if instance.user_id == current_user_id:
            # Add additional processing for the current user if needed
            user = instance.user
            data['fullName'] = f"{user.first_name} {user.last_name}"
            data['user_details'] = UserSerializer(user).data
            role = int(data.get("role", 0))

            if role >= 3:
                # Filter the members based on the role logic
                # Note: The below is a simple example, you might need to adjust based on your actual needs
                queryset = CampaignMember.objects.select_related('user').filter(campaign_id=instance.campaign_id)

                if role == 3:
                    # Get members whose supervisor is the current member's ID.
                    members = queryset.filter(Q(id=current_user_id) | Q(supervisor=current_user_id))
                else:  # role > 3
                    # Get the current member and their supervisor.
                    supervisor_id = data["supervisor"]
                    members = queryset.filter(Q(id=current_user_id) | Q(id=supervisor_id))
                
                data['filtered_members'] = CampaignMemberSerializer(members, many=True).data

        return data

class CampaignGuaranteeSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    gender = serializers.SerializerMethodField()
    membership_no = serializers.SerializerMethodField()
    box_no = serializers.SerializerMethodField()
    enrollment_date = serializers.SerializerMethodField()
    relationship = serializers.SerializerMethodField()
    elector_notes = serializers.SerializerMethodField()

    class Meta:
        model = CampaignGuarantee
        fields = [ "id", "campaign", "member", "civil", "full_name", "phone",
                  "gender", "membership_no", "box_no", "enrollment_date", "relationship",
                  "elector_notes", "notes", "status"
                  ]

    def get_full_name(self, obj):
        try:
            return obj.civil.full_name if obj.civil else None
        except Elector.DoesNotExist:
            return "Not Found"

    def get_gender(self, obj):
        try:
            return obj.civil.gender if obj.civil else None
        except Elector.DoesNotExist:
            return "Not Found"

    def get_membership_no(self, obj):
        try:
            return obj.civil.membership_no if obj.civil else None
        except Elector.DoesNotExist:
            return "Not Found"

    def get_box_no(self, obj):
        try:
            return obj.civil.box_no if obj.civil else None
        except Elector.DoesNotExist:
            return "Not Found"

    def get_enrollment_date(self, obj):
        try:
            return obj.civil.enrollment_date if obj.civil else None
        except Elector.DoesNotExist:
            return "Not Found"

    def get_relationship(self, obj):
        try:
            return obj.civil.relationship if obj.civil else None
        except Elector.DoesNotExist:
            return "Not Found"

    def get_elector_notes(self, obj):
        try:
            return obj.civil.notes if obj.civil else None
        except Elector.DoesNotExist:
            return "Not Found"



class CampaignAttendeeSerializer(TrackMixin, serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    civil = serializers.SerializerMethodField()
    gender = serializers.SerializerMethodField()
    membership_no = serializers.SerializerMethodField()
    box_no = serializers.SerializerMethodField()
    enrollment_date = serializers.SerializerMethodField()
    relationship = serializers.SerializerMethodField()
    elector_notes = serializers.SerializerMethodField()

    class Meta:
        model = CampaignAttendee
        fields = ["id", "election", "committee", "user", "civil", "full_name", "gender",
                  "membership_no", "box_no", "enrollment_date", "relationship", "elector_notes", "notes",
                  "status"
                  ]

    def get_full_name(self, obj):
        try:
            return obj.elector.full_name if obj.elector else None
        except Elector.DoesNotExist:
            return "Not Found"

    def get_gender(self, obj):
        try:
            return obj.elector.gender if obj.elector else None
        except Elector.DoesNotExist:
            return "Not Found"

    def get_membership_no(self, obj):
        try:
            return obj.elector.membership_no if obj.elector else None
        except Elector.DoesNotExist:
            return "Not Found"

    def get_box_no(self, obj):
        try:
            return obj.elector.box_no if obj.elector else None
        except Elector.DoesNotExist:
            return "Not Found"

    def get_enrollment_date(self, obj):
        try:
            return obj.elector.enrollment_date if obj.elector else None
        except Elector.DoesNotExist:
            return "Not Found"

    def get_relationship(self, obj):
        try:
            return obj.elector.relationship if obj.elector else None
        except Elector.DoesNotExist:
            return "Not Found"

    def get_elector_notes(self, obj):
        try:
            return obj.elector.notes if obj.elector else None
        except Elector.DoesNotExist:
            return "Not Found"
        
    def get_civil(self, obj):
        try:
            return obj.elector.civil if obj.elector else None
        except Elector.DoesNotExist:
            return "Not Found"


# For CampaignGuaranteeSerializer and CampaignAttendeeSerializer,
# you could have a method like this to avoid repeating the same logic
def get_field_or_not_found(self, obj, field_name):
    try:
        return getattr(obj, field_name) if obj else None
    except Elector.DoesNotExist:
        return "Not Found"
