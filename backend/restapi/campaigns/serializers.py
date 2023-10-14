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
    gender = serializers.IntegerField(source='civil.gender', default="Not Found", read_only=True)
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
        return CampaignAttendees.objects.filter(elector=obj.civil).exists()

    def create(self, validated_data):
        return super().create(validated_data)

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)


class CampaignAttendeesSerializer(AdminFieldMixin, serializers.ModelSerializer):

    class Meta:
        model = CampaignAttendees
        fields = [
            # Attendees' Fields
            "id", "user", "election", "committee", "elector", "notes", "status"] + ElectorsSerializer.Meta.fields 
        
    # Dynamically create SerializerMethodFields and their associated getters
    for elector_field in ElectorsSerializer.Meta.fields:
        exec(f"{elector_field} = serializers.SerializerMethodField()")

        def get_field_value(self, instance, elector_field=elector_field):  # using default arg to "freeze" the current field_name
            return getattr(instance.elector, elector_field, None)

        exec(f"get_{elector_field} = get_field_value")

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        for field in ElectorsSerializer.Meta.fields:
            rep[field] = self.get_field_value(instance, field)
        return rep

    def create(self, validated_data):
        return super().create(validated_data)

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)




# class CampaignAttendeesSerializer(TrackMixin, serializers.ModelSerializer):
#     full_name = serializers.SerializerMethodField()
#     civil = serializers.SerializerMethodField()
#     gender = serializers.SerializerMethodField()
#     membership_no = serializers.SerializerMethodField()
#     box_no = serializers.SerializerMethodField()
#     enrollment_date = serializers.SerializerMethodField()
#     relationship = serializers.SerializerMethodField()
#     elector_notes = serializers.SerializerMethodField()

#     class Meta:
#         model = CampaignAttendees
#         fields = ["id", "election", "committee", "user", "civil", "full_name", "gender",
#                   "membership_no", "box_no", "enrollment_date", "relationship", "elector_notes", "notes",
#                   "status"
#                   ]

#     def get_full_name(self, obj):
#         try:
#             return obj.elector.full_name if obj.elector else None
#         except Electors.DoesNotExist:
#             return "Not Found"

#     def get_gender(self, obj):
#         try:
#             return obj.elector.gender if obj.elector else None
#         except Electors.DoesNotExist:
#             return "Not Found"

#     def get_membership_no(self, obj):
#         try:
#             return obj.elector.membership_no if obj.elector else None
#         except Electors.DoesNotExist:
#             return "Not Found"

#     def get_box_no(self, obj):
#         try:
#             return obj.elector.box_no if obj.elector else None
#         except Electors.DoesNotExist:
#             return "Not Found"

#     def get_enrollment_date(self, obj):
#         try:
#             return obj.elector.enrollment_date if obj.elector else None
#         except Electors.DoesNotExist:
#             return "Not Found"

#     def get_relationship(self, obj):
#         try:
#             return obj.elector.relationship if obj.elector else None
#         except Electors.DoesNotExist:
#             return "Not Found"

#     def get_elector_notes(self, obj):
#         try:
#             return obj.elector.notes if obj.elector else None
#         except Electors.DoesNotExist:
#             return "Not Found"
        
#     def get_civil(self, obj):
#         try:
#             return obj.elector.civil if obj.elector else None
#         except Electors.DoesNotExist:
#             return "Not Found"


# For CampaignGuaranteesSerializer and CampaignAttendeesSerializer,
# you could have a method like this to avoid repeating the same logic
def get_field_or_not_found(self, obj, field_name):
    try:
        return getattr(obj, field_name) if obj else None
    except Electors.DoesNotExist:
        return "Not Found"
