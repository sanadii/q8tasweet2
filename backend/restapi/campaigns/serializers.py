# restapi/campaigns/serializers.py
from rest_framework import serializers
from restapi.helper.base_serializer import TrackMixin, TaskMixin, AdminFieldMixin

from restapi.models import (
    Elections, ElectionCandidates, ElectionCommittees,
    Candidates, 
    Campaigns, CampaignMembers, CampaignGuarantees, CampaignAttendees,
    Electors,
    Categories,
)

# from restapi.serializers import (
#     ElectionsSerializer,
#     CandidatesSerializer,
#     UserSerializer,
#     ElectorsSerializer,
# )
from restapi.serializers import CandidatesSerializer
from restapi.elections.serializers import ElectionsSerializer
from restapi.users.serializers import UserSerializer
from restapi.electors.serializers import ElectorsSerializer

class CampaignsSerializer(AdminFieldMixin, serializers.ModelSerializer):
    """ Serializer for the Campaign model. """
    admin_serializer_classes = (TrackMixin, TaskMixin)
    candidate = CandidatesSerializer(source='election_candidate.candidate', read_only=True)
    election = ElectionsSerializer(source='election_candidate.election', read_only=True)
    
    class Meta: 
        model = Campaigns
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
        from ..serializers import ElectionsSerializer, CandidatesSerializer

        election = ElectionsSerializer(read_only=True)
        candidate = CandidatesSerializer(read_only=True)
        user = UserSerializer(read_only=True)  # Assuming the user field name is 'user'
        # image = serializers.ImageField(use_url=True)  # Ensure the image's URL is returned, not its data

    class Meta:
        model = ElectionCandidates
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


class CampaignMembersSerializer(serializers.ModelSerializer):
    """ Serializer for the CampaignMembers model. """
    fullName = serializers.SerializerMethodField()

    class Meta:
        model = CampaignMembers
        fields = ["id", "user", "campaign", "role", "supervisor", "committee", 
                  "civil", "phone", "notes", "status", "fullName"]

    def get_fullName(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        
        request = self.context.get('request')
        current_user = request.user
        if current_user.is_staff:
            return rep

        role = int(rep.get("role", 0))
        
        if role == 3:
            if not (rep["id"] == instance.id or rep["supervisor"] == instance.id):
                return {}
        elif role > 3:
            supervisor_id = rep.get("supervisor")
            if not (rep["id"] == instance.id or rep["id"] == supervisor_id):
                return {}

        return rep


class CampaignGuaranteesSerializer(serializers.ModelSerializer):

    # get the data from Electors Model Directly
    full_name = serializers.CharField(source='civil.full_name', default="Not Found", read_only=True)
    gender = serializers.IntegerField(source='civil.gender', default=-1, read_only=True)
    membership_no = serializers.CharField(source='civil.membership_no', default="Not Found", read_only=True)
    box_no = serializers.CharField(source='civil.box_no', default="Not Found", read_only=True)
    enrollment_date = serializers.DateField(source='civil.enrollment_date', default=None, read_only=True)
    relationship = serializers.CharField(source='civil.relationship', default="Not Found", read_only=True)
    elector_notes = serializers.CharField(source='civil.notes', default="Not Found", read_only=True)
    attended = serializers.SerializerMethodField()

    class Meta:
        model = CampaignGuarantees
        fields = [
            "id", "campaign", "member",
            "civil", "full_name", "gender", "attended",
            "phone", "notes", "status",
            "membership_no", "box_no", "enrollment_date", "relationship", "elector_notes",
            ]

    def get_attended(self, obj):
        return CampaignAttendees.objects.filter(civil=obj.civil).exists()

    def create(self, validated_data):
        return super().create(validated_data)

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)


class CampaignAttendeesSerializer(serializers.ModelSerializer):
    # Directly get the data from the Electors Model
    full_name = serializers.CharField(source='civil.full_name', default="Not Found", read_only=True)
    gender = serializers.IntegerField(source='civil.gender', default=-1, read_only=True)
    membership_no = serializers.CharField(source='civil.membership_no', default="Not Found", read_only=True)
    box_no = serializers.CharField(source='civil.box_no', default="Not Found", read_only=True)
    enrollment_date = serializers.DateField(source='civil.enrollment_date', default=None, read_only=True)
    relationship = serializers.CharField(source='civil.relationship', default="Not Found", read_only=True)
    elector_notes = serializers.CharField(source='civil.notes', default="Not Found", read_only=True)
    # attended field will not be included here since it's specific to CampaignGuarantees model

    class Meta:
        model = CampaignAttendees
        fields = [
            "id", "user", "election", "committee", "civil", "notes", "status",
            "full_name", "gender", "membership_no", "box_no", "enrollment_date",
            "relationship", "elector_notes",
        ]

    def create(self, validated_data):
        return super().create(validated_data)

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)



# For CampaignGuaranteesSerializer and CampaignAttendeesSerializer,
# you could have a method like this to avoid repeating the same logic
def get_field_or_not_found(self, obj, field_name):
    try:
        return getattr(obj, field_name) if obj else None
    except Electors.DoesNotExist:
        return "Not Found"
