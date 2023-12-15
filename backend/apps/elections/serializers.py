# elections/serializers.py
from rest_framework import serializers
from datetime import datetime  # Importing datetime
from django.db.models import F

from helper.base_serializer import TrackMixin, TaskMixin, AdminFieldMixin
# Models
from apps.elections.models import (
    Election,
    ElectionCategory,
    ElectionCandidate,
    ElectionCommittee,
    ElectionCommitteeResult,
)

from apps.campaigns.models import CampaignSorting

class ElectionSerializer(serializers.ModelSerializer):
    """ Serializer for the Election model. """
    # admin_serializer_classes = (TrackMixin, TaskMixin)
    name = serializers.SerializerMethodField('get_election_name')
    image = serializers.SerializerMethodField('get_election_image')
    previous_election = serializers.SerializerMethodField()
    due_date = serializers.DateField(format="%Y-%m-%d", input_formats=["%Y-%m-%d",], allow_null=True, required=False)
    category_name  = serializers.SerializerMethodField('get_category_name')
    sub_category_name  = serializers.SerializerMethodField('get_sub_category_name')

    class Meta:
        model = Election
        fields = [
            'id', 'name', 'slug', 'image', 'due_date',
            'category', 'sub_category', 'category_name', 'sub_category_name',
            'elect_type', 'elect_result', 'elect_votes', 'elect_seats',
            'electors', 'electors_males', 'electors_females',
            'attendees', 'attendees_males', 'attendees_females',
            'previous_election',

            # Track & Task Fields
            'created_by', 'updated_by', 'deleted_by', 'created_at', 'updated_at', 'deleted_at', 'deleted',
            'priority', 'status',
        ]

    def get_election_name(self, obj):
        sub_category = getattr(obj, 'sub_category', None)
        if sub_category:
            year = getattr(obj.due_date, 'year', None)
            return f"{sub_category.name} - {year or ''}"
        return None
    
    def get_sub_category_name(self, obj):
        sub_category = getattr(obj, 'sub_category', None)
        if sub_category:
            return f"{sub_category.name}"
        return None


    def get_category_name(self, obj):
        category = getattr(obj, 'category', None)
        if category:
            return f"{category.name}"
        return None

    def get_election_image(self, obj):
        sub_category = getattr(obj, 'sub_category', None)
        if sub_category:
            image = getattr(sub_category, 'image', None)
            if image:
                return image.url
        return None
    
    # Used for Add / Update / Delete

    def to_internal_value(self, data):
        # Convert string representation of due_date to date object
        if 'due_date' in data and data['due_date']:
            data['due_date'] = self.extract_date(data['due_date'])
        
        return super().to_internal_value(data)

    def extract_date(self, date_str):
        if date_str and isinstance(date_str, str):
            try:
                return datetime.strptime(date_str, "%Y-%m-%d").date()
            except ValueError:
                raise serializers.ValidationError("Incorrect date format, should be YYYY-MM-DD")
        return None
    
    def get_previous_election(self, obj):
        previous_election = Election.objects.filter(
            sub_category=obj.sub_category,
            due_date__lt=obj.due_date
        ).order_by('-due_date').first()

        if previous_election:
            data = {
                "seats": previous_election.elect_seats,
                # ... other fields you want to include ...
            }

            # Get election candidates
            election_candidates = ElectionCandidate.objects.filter(
                election=previous_election
            ).order_by('-votes')

            if election_candidates.exists():
                first_winner = election_candidates.first()
                last_winner = election_candidates[previous_election.elect_seats - 1] if previous_election.elect_seats > 0 else None
                
                data.update({
                    "first_winner": ElectionCandidateSerializer(first_winner).data,
                    "last_winner": ElectionCandidateSerializer(last_winner).data if last_winner else None,
                    "median_winner": sum(candidate.votes for candidate in election_candidates[:previous_election.elect_seats]) // previous_election.elect_seats if previous_election.elect_seats > 0 else None,
                })

            return data
        return None

    def create(self, validated_data):
        # Extract task-related data if present
        task_data = validated_data.pop('task', {})

        # Create the Election instance
        election = Election.objects.create(**validated_data)

        # Manually update task-related fields
        self.update_task_fields(election, task_data)

        return election

    def update(self, instance, validated_data):
        # Extract task-related data if present
        task_data = validated_data.pop('task', {})

        # Update the Election instance
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Manually update task-related fields
        self.update_task_fields(instance, task_data)

        return instance

    def update_task_fields(self, election, task_data):
        # Update priority and status from task_data if they are present
        if 'priority' in task_data:
            election.priority = task_data['priority']
        if 'status' in task_data:
            election.status = task_data['status']
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

class ElectionCandidateVoteSerializer(serializers.ModelSerializer):
    admin_serializer_classes = (TrackMixin,)

    class Meta:
        model = ElectionCommitteeResult
        # fields = "__all__"
        fields = ["election_committee", "votes"]

class ElectionCandidateSortingVoteSerializer(serializers.ModelSerializer):

    class Meta:
        model = CampaignSorting
        fields = '__all__'

class ElectionCandidateSerializer(AdminFieldMixin, serializers.ModelSerializer):
    """ Serializer for the ElectionCandidate model. """
    admin_serializer_classes = (TrackMixin,)

    name = serializers.CharField(source='candidate.name', read_only=True)
    gender = serializers.IntegerField(source='candidate.gender', read_only=True)
    image = serializers.SerializerMethodField('get_candidate_image')
    committee_votes = ElectionCandidateVoteSerializer(source='committee_result_candidates', many=True, read_only=True)
    committee_sorting = ElectionCandidateSortingVoteSerializer(source='election_candiddate_sortings', many=True, read_only=True)

    class Meta:
        model = ElectionCandidate
        fields = ["id", "election", "candidate", "name", "gender", "image", "votes", "notes", "committee_votes", "committee_sorting"]

    def get_candidate_image(self, obj):
        if obj.candidate and obj.candidate.image:
            return obj.candidate.image.url
        return None

    def create(self, validated_data):
        """ Customize creation (POST) of an instance """
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        """ Customize update (PUT, PATCH) of an instance """
        # Additional logic to customize instance updating
        return super().update(instance, validated_data)


class ElectionCommitteeSerializer(AdminFieldMixin, serializers.ModelSerializer):
    """ Serializer for the ElectionCommittee model. """
    admin_serializer_classes = (TrackMixin,)
    
    class Meta:
        model = ElectionCommittee
        fields = ["id", "election", "name", "gender", "location"]

    def create(self, validated_data):
        """ Customize creation (POST) of an instance """
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """ Customize update (PUT, PATCH) of an instance """
        # Additional logic to customize instance updating
        return super().update(instance, validated_data)

class ElectionCommitteeResultSerializer(AdminFieldMixin, serializers.ModelSerializer):
    admin_serializer_classes = (TrackMixin,)

    class Meta:
        model = ElectionCommitteeResult
        fields = "__all__"