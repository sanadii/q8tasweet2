# restapi/campaigns/serializers.py
from rest_framework import serializers
from restapi.base_serializer import TrackMixin, TaskMixin, AdminFieldMixin

from restapi.models import (
    Elections, ElectionCandidates, ElectionCommittees,
    Candidates, 
    Campaigns, CampaignMembers, CampaignGuarantees, ElectionAttendees,
    Electors,
    Categories,
)

from restapi.candidates.serializers import CandidatesSerializer
from restapi.elections.serializers import ElectionsSerializer

class CampaignsSerializer(AdminFieldMixin, serializers.ModelSerializer):
    """ Serializer for the Campaign model. """
    admin_serializer_classes = (TrackMixin, TaskMixin)

    candidate = CandidatesSerializer(source='election_candidate.candidate', read_only=True, context={"exclude_task_track": True})
    election = ElectionsSerializer(source='election_candidate.election', read_only=True, context={"exclude_task_track": True})
    
    class Meta: 
        model = Campaigns
        fields = [
            # Basic Information
            "election", "candidate", "description",

            # Media Coverage
            "twitter", "instagram", "website",

            # Activities
            "target_score", "results", "events",
        ]




class CampaignDetailsSerializer(serializers.ModelSerializer):

    def get_elections_candidates(self):
        from ..serializers import ElectionsSerializer, CandidatesSerializer

        election = ElectionsSerializer(read_only=True)
        candidate = CandidatesSerializer(read_only=True)
        # user = UserSerializer(read_only=True)  # Assuming the user field name is 'user'
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


class CampaignElectionSerializer(TrackMixin, serializers.ModelSerializer):
    class Meta:
        model = Elections
        fields = "__all__"

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return {"election_" + key: value for key, value in representation.items()}


class CampaignCandidateSerializer(TrackMixin, serializers.ModelSerializer):
    class Meta:
        model = Candidates
        fields = "__all__"

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return {"candidate_" + key: value for key, value in representation.items()}


class CampaignMembersSerializer(TrackMixin, serializers.ModelSerializer):

    def get_serializers(self):
        from ..serializers import UserSerializer
        user = UserSerializer()  # Removed source="user"
        rank = serializers.IntegerField()

    class Meta:
        model = CampaignMembers
        fields = [ "id", "user", "campaign", "rank", "supervisor", "committee", "notes", "phone", "status"]

class CampaignGuaranteesSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    gender = serializers.SerializerMethodField()
    membership_no = serializers.SerializerMethodField()
    box_no = serializers.SerializerMethodField()
    enrollment_date = serializers.SerializerMethodField()
    relationship = serializers.SerializerMethodField()
    elector_notes = serializers.SerializerMethodField()

    class Meta:
        model = CampaignGuarantees
        fields = [ "id", "campaign", "member", "civil", "full_name", "phone",
                  "gender", "membership_no", "box_no", "enrollment_date", "relationship",
                  "elector_notes", "notes", "status"
                  ]

    def get_full_name(self, obj):
        try:
            return obj.civil.full_name if obj.civil else None
        except Electors.DoesNotExist:
            return "Not Found"

    def get_gender(self, obj):
        try:
            return obj.civil.gender if obj.civil else None
        except Electors.DoesNotExist:
            return "Not Found"

    def get_membership_no(self, obj):
        try:
            return obj.civil.membership_no if obj.civil else None
        except Electors.DoesNotExist:
            return "Not Found"

    def get_box_no(self, obj):
        try:
            return obj.civil.box_no if obj.civil else None
        except Electors.DoesNotExist:
            return "Not Found"

    def get_enrollment_date(self, obj):
        try:
            return obj.civil.enrollment_date if obj.civil else None
        except Electors.DoesNotExist:
            return "Not Found"

    def get_relationship(self, obj):
        try:
            return obj.civil.relationship if obj.civil else None
        except Electors.DoesNotExist:
            return "Not Found"

    def get_elector_notes(self, obj):
        try:
            return obj.civil.notes if obj.civil else None
        except Electors.DoesNotExist:
            return "Not Found"



class ElectionAttendeesSerializer(TrackMixin, serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    civil = serializers.SerializerMethodField()
    gender = serializers.SerializerMethodField()
    membership_no = serializers.SerializerMethodField()
    box_no = serializers.SerializerMethodField()
    enrollment_date = serializers.SerializerMethodField()
    relationship = serializers.SerializerMethodField()
    elector_notes = serializers.SerializerMethodField()

    class Meta:
        model = ElectionAttendees
        fields = ["id", "election", "committee", "user", "civil", "full_name", "gender",
                  "membership_no", "box_no", "enrollment_date", "relationship", "elector_notes", "notes",
                  "status"
                  ]

    def get_full_name(self, obj):
        try:
            return obj.elector.full_name if obj.elector else None
        except Electors.DoesNotExist:
            return "Not Found"

    def get_gender(self, obj):
        try:
            return obj.elector.gender if obj.elector else None
        except Electors.DoesNotExist:
            return "Not Found"

    def get_membership_no(self, obj):
        try:
            return obj.elector.membership_no if obj.elector else None
        except Electors.DoesNotExist:
            return "Not Found"

    def get_box_no(self, obj):
        try:
            return obj.elector.box_no if obj.elector else None
        except Electors.DoesNotExist:
            return "Not Found"

    def get_enrollment_date(self, obj):
        try:
            return obj.elector.enrollment_date if obj.elector else None
        except Electors.DoesNotExist:
            return "Not Found"

    def get_relationship(self, obj):
        try:
            return obj.elector.relationship if obj.elector else None
        except Electors.DoesNotExist:
            return "Not Found"

    def get_elector_notes(self, obj):
        try:
            return obj.elector.notes if obj.elector else None
        except Electors.DoesNotExist:
            return "Not Found"
        
    def get_civil(self, obj):
        try:
            return obj.elector.civil if obj.elector else None
        except Electors.DoesNotExist:
            return "Not Found"


# For CampaignGuaranteesSerializer and ElectionAttendeesSerializer,
# you could have a method like this to avoid repeating the same logic
def get_field_or_not_found(self, obj, field_name):
    try:
        return getattr(obj, field_name) if obj else None
    except Electors.DoesNotExist:
        return "Not Found"
