# elections/serializers.py
from rest_framework import serializers
from datetime import datetime  # Importing datetime
from django.db.models import F
import json

from utils.base_serializer import TrackMixin, TaskMixin, AdminFieldMixin

# Models
from apps.areas.models import Area

from apps.elections.models import (
    Election,
    ElectionCategory,
    ElectionCandidate,
    ElectionParty,
    ElectionPartyCandidate,
    ElectionCommittee,
    ElectionCommitteeGroup,
    ElectionCommitteeResult,
    ElectionPartyCandidateCommitteeResult,
    ElectionPartyCommitteeResult,
)

# from apps.committees.models import Committee, CommitteeGroup
from apps.campaigns.models import CampaignSorting

from apps.auths.serializers import UserSerializer


class ElectionSerializer(serializers.ModelSerializer):
    """Serializer for the Election model."""

    # admin_serializer_classes = (TrackMixin, TaskMixin)
    name = serializers.SerializerMethodField("get_election_name")
    image = serializers.SerializerMethodField("get_election_image")
    previous_election = serializers.SerializerMethodField()
    due_date = serializers.DateField(
        format="%Y-%m-%d",
        input_formats=[
            "%Y-%m-%d",
        ],
        allow_null=True,
        required=False,
    )
    category_name = serializers.SerializerMethodField("get_category_name")
    sub_category_name = serializers.SerializerMethodField("get_sub_category_name")

    election_result_view = serializers.SerializerMethodField()
    election_result_party = serializers.SerializerMethodField()
    election_result_sorting = serializers.SerializerMethodField()

    class Meta:
        model = Election
        fields = [
            "id",
            "name",
            "slug",
            "image",
            "due_date",
            "category",
            "sub_category",
            "category_name",
            "sub_category_name",
            "election_method",
            "election_result",
            "election_result_view",
            "election_result_party",
            "election_result_sorting",
            "elect_votes",
            "elect_seats",
            "voters",
            "voters_males",
            "voters_females",
            "attendees",
            "attendees_males",
            "attendees_females",
            "previous_election",
            # Track & Task Fields
            "created_by",
            "updated_by",
            "deleted_by",
            "created_at",
            "updated_at",
            "deleted_at",
            "deleted",
            "priority",
            "status",
        ]

    def get_election_name(self, obj):
        sub_category = getattr(obj, "sub_category", None)
        if sub_category:
            year = getattr(obj.due_date, "year", None)
            return f"{sub_category.name} - {year or ''}"
        return None

    def get_sub_category_name(self, obj):
        sub_category = getattr(obj, "sub_category", None)
        if sub_category:
            return f"{sub_category.name}"
        return None

    def get_category_name(self, obj):
        category = getattr(obj, "category", None)
        if category:
            return f"{category.name}"
        return None

    def get_election_image(self, obj):
        sub_category = getattr(obj, "sub_category", None)
        if sub_category:
            image = getattr(sub_category, "image", None)
            if image:
                return image.url
        return None

    # Results
    def get_election_result_view(self, obj):
        return self.parse_json_field(obj.election_result).get("view")

    def get_election_result_party(self, obj):
        return self.parse_json_field(obj.election_result).get("party")

    def get_election_result_sorting(self, obj):
        return self.parse_json_field(obj.election_result).get("sorting")

    def parse_json_field(self, json_str):
        try:
            return json.loads(json_str) if json_str else {}
        except json.JSONDecodeError:
            return {}

    # Used for Add / Update / Delete
    def to_internal_value(self, data):
        # Convert string representation of due_date to date object
        if "dueDate" in data and data["dueDate"]:
            data["due_date"] = self.extract_date(data["dueDate"])

        return super().to_internal_value(data)

    def extract_date(self, date_str):
        if date_str and isinstance(date_str, str):
            try:
                return datetime.strptime(date_str, "%Y-%m-%d").date()
            except ValueError:
                raise serializers.ValidationError(
                    "Incorrect date format, should be YYYY-MM-DD"
                )
        return None

    def get_previous_election(self, obj):
        previous_election = (
            Election.objects.filter(
                sub_category=obj.sub_category, due_date__lt=obj.due_date
            )
            .order_by("-due_date")
            .first()
        )

        if previous_election:
            data = {
                "seats": previous_election.elect_seats,
                # ... other fields you want to include ...
            }

            # Get election candidates
            election_candidates = ElectionCandidate.objects.filter(
                election=previous_election
            ).order_by("-votes")

            if election_candidates.exists():
                first_winner = election_candidates.first()
                last_winner = (
                    election_candidates[previous_election.elect_seats - 1]
                    if previous_election.elect_seats > 0
                    else None
                )

                data.update(
                    {
                        "first_winner": ElectionCandidateSerializer(first_winner).data,
                        "last_winner": (
                            ElectionCandidateSerializer(last_winner).data
                            if last_winner
                            else None
                        ),
                        "median_winner": (
                            sum(
                                candidate.votes
                                for candidate in election_candidates[
                                    : previous_election.elect_seats
                                ]
                            )
                            // previous_election.elect_seats
                            if previous_election.elect_seats > 0
                            else None
                        ),
                    }
                )

            return data
        return None

    def create(self, validated_data):
        # Extract task-related data if present
        task_data = validated_data.pop("task", {})

        # Create the Election instance
        election = Election.objects.create(**validated_data)

        # Manually update task-related fields
        self.update_task_fields(election, task_data)

        return election

    def update(self, instance, validated_data):
        # Extract task-related data if present
        task_data = validated_data.pop("task", {})

        # Update the Election instance
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Manually update task-related fields
        self.update_task_fields(instance, task_data)

        return instance

    def update_task_fields(self, election, task_data):
        # Update priority and status from task_data if they are present
        if "priority" in task_data:
            election.priority = task_data["priority"]
        if "status" in task_data:
            election.status = task_data["status"]
        election.save()


class CategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElectionCategory
        fields = ["id", "name", "image", "parent"]


# SUB-CATEGORIES
class SubCategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElectionCategory
        fields = ["id", "name", "parent", "image"]


# Votting and Sorting
class ElectionCommitteeResultSerializer(serializers.ModelSerializer):
    admin_serializer_classes = (TrackMixin,)

    class Meta:
        model = ElectionCommitteeResult
        # fields = "__all__"
        fields = ["election_committee", "votes"]


class ElectionPartyCommitteeResultSerializer(
    AdminFieldMixin, serializers.ModelSerializer
):
    admin_serializer_classes = (TrackMixin,)

    class Meta:
        model = ElectionPartyCommitteeResult
        fields = ["election_committee", "votes"]


class ElectionPartyCandidateCommitteeResultSerializer(
    AdminFieldMixin, serializers.ModelSerializer
):
    admin_serializer_classes = (TrackMixin,)

    class Meta:
        model = ElectionPartyCandidateCommitteeResult
        fields = ["election_committee", "votes"]


class CampaignSortingSerializer(serializers.ModelSerializer):

    class Meta:
        model = CampaignSorting
        fields = "__all__"


# Candidates and Parties
class ElectionCandidateSerializer(AdminFieldMixin, serializers.ModelSerializer):
    """Serializer for the ElectionCandidate model."""

    admin_serializer_classes = (TrackMixin,)

    name = serializers.CharField(source="candidate.name", read_only=True)
    gender = serializers.IntegerField(source="candidate.gender", read_only=True)
    image = serializers.SerializerMethodField("get_candidate_image")
    committee_votes = ElectionCommitteeResultSerializer(
        source="committee_result_candidates", many=True, read_only=True
    )
    committee_sorting = serializers.SerializerMethodField()

    class Meta:
        model = ElectionCandidate
        fields = [
            "id",
            "election",
            "candidate",
            "name",
            "gender",
            "image",
            "votes",
            "notes",
            "committee_votes",
            "committee_sorting",
        ]

    def get_committee_sorting(self, obj):
        # Access the request context from self.context
        request = self.context.get("request") if self.context else None
        source = (
            "election_candidate_sortings"
            if request and "GetElectionDetails" in request.resolver_match.url_name
            else "campaign_candidate_sortings"
        )
        # Assuming you have a method to get the sorting data from the source
        sorting_data = self.get_sorting_data_from_source(obj, source)
        return CampaignSortingSerializer(sorting_data, many=True, read_only=True).data

    # You might need to implement this method based on your logic
    def get_sorting_data_from_source(self, obj, source):
        if source == "election_candidate_sortings":
            return (
                obj.election_candidate_sortings.all()
            )  # Replace with appropriate query
        elif source == "campaign_candidate_sortings":
            return (
                obj.campaign_candidate_sortings.all()
            )  # Replace with appropriate query
        else:
            raise ValueError(f"Invalid source: {source}")

    def get_candidate_image(self, obj):
        if obj.candidate and obj.candidate.image:
            return obj.candidate.image.url
        return None

    def create(self, validated_data):
        """Customize creation (POST) of an instance"""
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """Customize update (PUT, PATCH) of an instance"""
        # Additional logic to customize instance updating
        return super().update(instance, validated_data)


class ElectionPartySerializer(AdminFieldMixin, serializers.ModelSerializer):
    """Serializer for the ElectionParty model."""

    admin_serializer_classes = (TrackMixin,)

    name = serializers.CharField(source="party.name", read_only=True)
    image = serializers.SerializerMethodField("get_party_image")
    committee_votes = ElectionPartyCommitteeResultSerializer(
        source="party_committee_result_candidates", many=True, read_only=True
    )
    # committee_sorting = serializers.SerializerMethodField()

    class Meta:
        model = ElectionParty
        fields = [
            "id",
            "election",
            "party",
            "name",
            "image",
            "votes",
            "notes",
            "committee_votes",
            # "committee_sorting"
        ]

    def get_party_image(self, obj):
        if obj.party and obj.party.image:
            return obj.party.image.url
        return None

    def create(self, validated_data):
        """Customize creation (POST) of an instance"""
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """Customize update (PUT, PATCH) of an instance"""
        # Additional logic to customize instance updating
        return super().update(instance, validated_data)


class ElectionPartyCandidateSerializer(AdminFieldMixin, serializers.ModelSerializer):
    """Serializer for the ElectionPartyCandidate model."""

    admin_serializer_classes = (TrackMixin,)

    name = serializers.CharField(source="candidate.name", read_only=True)
    gender = serializers.IntegerField(source="candidate.gender", read_only=True)
    image = serializers.SerializerMethodField("get_candidate_image")
    committee_votes = ElectionPartyCandidateCommitteeResultSerializer(
        source="party_candidate_committee_result_candidates", many=True, read_only=True
    )
    # committee_sorting = serializers.SerializerMethodField()

    class Meta:
        model = ElectionPartyCandidate
        fields = [
            "id",
            "election_party",
            "candidate",
            "name",
            "gender",
            "image",
            "votes",
            "notes",
            "committee_votes",
            # "committee_sorting"
        ]

    def get_candidate_image(self, obj):
        if obj.candidate and obj.candidate.image:
            return obj.candidate.image.url
        return None

    def create(self, validated_data):
        """Customize creation (POST) of an instance"""
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """Customize update (PUT, PATCH) of an instance"""
        # Additional logic to customize instance updating
        return super().update(instance, validated_data)


# Committees & Committee Results
class ElectionCommitteeSerializer(serializers.ModelSerializer):
    """Serializer for the ElectionCommittee model."""

    class Meta:
        model = ElectionCommittee
        fields = ['id', 'serial', 'letters', 'areas']

class AreaSerializer(serializers.ModelSerializer):
    """Serializer for the Area model."""

    class Meta:
        model = Area
        fields = ['id', 'name', 'code', 'governorate']

class ElectionCommitteeGroupSerializer(serializers.ModelSerializer):
    """Serializer for the ElectionCommitteeGroup model."""

    committees = ElectionCommitteeSerializer(many=True, read_only=True)
    area = AreaSerializer(read_only=True)

    class Meta:
        model = ElectionCommitteeGroup
        fields = [
            'id', 'name', 'committee_no', 'circle', 'area', 'gender', 
            'description', 'address', 'voter_count', 'committee_count', 'total_voters', 'tags', 
            'committees'
        ]

    def create(self, validated_data):
        """Customize creation (POST) of an instance"""
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """Customize update (PUT, PATCH) of an instance"""
        # Additional logic to customize instance updating
        return super().update(instance, validated_data)


# class ElectionCommitteeSerializer(AdminFieldMixin, serializers.ModelSerializer):
#     """Serializer for the ElectionCommittee model."""

#     admin_serializer_classes = (TrackMixin,)

#     # sorter = UserSerializer(read_only=True)

#     class Meta:
#         model = ElectionCommittee
#         fields = ["id", "election", "name", "gender", "location", "sorter"]

#     def create(self, validated_data):
#         """Customize creation (POST) of an instance"""
#         return super().create(validated_data)

#     def update(self, instance, validated_data):
#         """Customize update (PUT, PATCH) of an instance"""
#         # Additional logic to customize instance updating
#         return super().update(instance, validated_data)
