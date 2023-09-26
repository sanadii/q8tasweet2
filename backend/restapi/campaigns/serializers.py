# Campaign Serializers
from rest_framework import serializers
from ..models import Elections, ElectionCandidates, ElectionAttendees, Candidates, Campaigns, CampaignMembers, CampaignGuarantees, Electors

class CampaignsSerializer(serializers.ModelSerializer):

    candidate = serializers.SerializerMethodField()
    election = serializers.SerializerMethodField()

    class Meta:
        model = Campaigns
        fields = "__all__"  # add 'candidate', 'election' if you want them to show explicitly

    # Candidate
    def get_candidate(self, instance):
        election_candidate = getattr(instance, 'election_candidate', None)
        if election_candidate:
            candidate = getattr(election_candidate, 'candidate', None)
            if candidate:
                image = getattr(candidate, 'image', None)
                return {
                    "id": getattr(candidate, 'id', None),
                    "name": getattr(candidate, 'name', None),
                    "image": image.url if image else None,
                    "gender": getattr(candidate, 'gender', None),
                    "phone": getattr(candidate, 'phone', None),
                    "email": getattr(candidate, 'email', None),
                    "twitter": getattr(candidate, 'twitter', None),
                    "instagram": getattr(candidate, 'instagram', None),
                    "description": getattr(candidate, 'description', None),
                }
            return None  # or return a default dict if you prefer


    # Election
    def get_election(self, instance):
        election_candidate = getattr(instance, 'election_candidate', None)
        if election_candidate:
            election = getattr(election_candidate, 'election', None)
            if election:
                image = getattr(election, 'image', None)
                return {
                    "id": getattr(election, 'id', None),
                    "name": getattr(election, 'name', None),
                    "image": image.url if image else None,
                    "duedate": getattr(election, 'duedate', None),
                    "category": getattr(election, 'category', None),
                    "subCategory": getattr(election, 'subCategory', None),
                    "type": getattr(election, 'type', None),
                    "result": getattr(election, 'result', None),
                    "votes": getattr(election, 'votes', None),
                    "seats": getattr(election, 'seats', None),
                    "electors": getattr(election, 'electors', None),
                    "attendees": getattr(election, 'attendees', None),
                }
            return None  # or return a default dict if you prefer

# # Further improvement of the serializers
# class CandidateSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Candidate  # replace with your actual Candidate model
#         fields = ['id', 'name', 'image', 'gender', ...]  # list all the fields you need

# class ElectionSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Election  # replace with your actual Election model
#         fields = ['id', 'name', 'image', 'duedate', ...]  # list all the fields you need

# class CampaignsSerializer(serializers.ModelSerializer):
#     candidate = CandidateSerializer(source='election_candidate.candidate', read_only=True)
#     election = ElectionSerializer(source='election_candidate.election', read_only=True)

#     class Meta:
#         model = Campaigns
#         fields = "__all__"  # the nested serializers are included automatically


class CampaignElectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Elections
        fields = "__all__"

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return {"election_" + key: value for key, value in representation.items()}


class CampaignCandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidates
        fields = "__all__"

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return {"candidate_" + key: value for key, value in representation.items()}


class CampaignMembersSerializer(serializers.ModelSerializer):

    def get_serializers(self):
        from ..serializers import UserSerializer
        user = UserSerializer()  # Removed source="user"
        rank = serializers.IntegerField()

    class Meta:
        model = CampaignMembers
        fields = [
            # Member Data
            "id",
            "user",
            "campaign",
            "rank",
            "supervisor",
            "committee",
            "notes",
            "mobile",
            "status",
        ]


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
        fields = [
            "id",
            "campaign",
            "member",
            "civil",
            "full_name",
            "mobile",
            "gender",
            "membership_no",
            "box_no",
            "enrollment_date",
            "relationship",
            "elector_notes",
            "notes",
            "status",
            # "created_by",
            # "updated_by",
            # "deleted_by",
            # "created_date",
            # "updated_date",
            # "deleted_date",
            "deleted",
        ]
    # def get_full_name(self, obj):
    #     if obj.civil:
    #         elector = obj.civil
    #         names = [elector.name_1, elector.name_2, elector.name_3, elector.name_4, elector.last_name]
    #         return ' '.join([name for name in names if name])  # concatenate non-empty names
    #     return None

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


class CampaignDetailsSerializer(serializers.ModelSerializer):

    def get_elections_candidates(self):
        from ..serializers import ElectionsSerializer, CandidatesSerializer

        election = ElectionsSerializer(read_only=True)
        candidate = CandidatesSerializer(read_only=True)
        # user = UserSerializer(read_only=True)  # Assuming the user field name is 'user'
        # image = serializers.ImageField(use_url=True)  # Ensure the image's URL is returned, not its data

    class Meta:
        model = ElectionCandidates
        fields = [
            "id",
            "position",
            "votes",
            "is_winner",
            "deleted",
            "election",
            "candidate",
        ]

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


class ElectionAttendeesSerializer(serializers.ModelSerializer):
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
        fields = [
            "id",
            "election",
            "committee",
            "user",
            "civil",
            "full_name",
            "gender",
            "membership_no",
            "box_no",
            "enrollment_date",
            "relationship",
            "elector_notes",
            "notes",
            "status",
            "deleted",
        ]

    # def get_full_name(self, obj):
    #     if obj.elector:
    #         elector = obj.elector
    #         names = [elector.name_1, elector.name_2, elector.name_3, elector.name_4, elector.last_name]
    #         return ' '.join([name for name in names if name])  # concatenate non-empty names
    #     return None

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
