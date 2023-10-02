# restapi/elections/serializers.py
from rest_framework import serializers
from datetime import datetime  # Importing datetime
import json

from restapi.base_serializer import TrackMixin, TaskMixin, AdminFieldMixin
from restapi.models import (
    Elections, ElectionCandidates, ElectionCommittees, ElectionCommitteeResults,
    Campaigns, Candidates, Categories, Electors
    )


class ElectionsSerializer(AdminFieldMixin, serializers.ModelSerializer):
    """ Serializer for the Elections model. """
    admin_serializer_classes = (TrackMixin, TaskMixin)  # Define the tuple of admin serializers here.

    name = serializers.SerializerMethodField('get_election_name')
    image = serializers.SerializerMethodField('get_election_image')
    
    class Meta:
        model = Elections
        fields = [
            "id", "name", "image", "due_date",
            "category", "sub_category",
            "elect_type", "elect_result", "elect_votes", "elect_seats",
            "electors", "electors_males", "electors_females",
            "attendees", "attendees_males", "attendees_females",
        ]
            

    def get_election_name(self, obj):
        sub_category = getattr(obj, 'sub_category', None)
        if sub_category:
            year = getattr(obj.due_date, 'year', None)
            return f"{sub_category.name} - {year or 'No Due Date'}"
        return None

    def get_election_image(self, obj):
        sub_category = getattr(obj, 'sub_category', None)
        if sub_category:
            image = getattr(sub_category, 'image', None)
            if image:
                return image.url
        return None
    
    # Used for Add / Update / Delete
    due_date = serializers.DateField(format="%Y-%m-%d", input_formats=["%Y-%m-%d",], allow_null=True, required=False)

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
    
    def create(self, validated_data):
        # Here you can perform additional transformations if needed before creating the instance
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Here you can perform additional transformations if needed before updating the instance
        return super().update(instance, validated_data)

class ElectionCandidatesSerializer(AdminFieldMixin, serializers.ModelSerializer):
    """ Serializer for the ElectionCandidates model. """
    admin_serializer_classes = (TrackMixin,)

    class Meta:
        model = ElectionCandidates
        fields = ["id", "election_id", "candidate_id", "name", "gender", "image", "votes", "is_active"]
    name = serializers.SerializerMethodField('get_candidate_name')
    image = serializers.SerializerMethodField('get_candidate_image')
    gender = serializers.CharField(source='candidate.gender', read_only=True)

    def get_candidate_name(self, obj):
        return obj.candidate.name if obj.candidate else None
    
    def get_candidate_image(self, obj):
        if obj.candidate:
            from restapi.serializers import CandidatesSerializer
            candidate_serializer = CandidatesSerializer(obj.candidate)
            return candidate_serializer.data.get("image", None)
        return None

    def create(self, validated_data):
        """ Customize creation (POST) of an instance """
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        """ Customize update (PUT, PATCH) of an instance """
        # Additional logic to customize instance updating
        return super().update(instance, validated_data)

class ElectionCommitteesSerializer(AdminFieldMixin, serializers.ModelSerializer):
    admin_serializer_classes = (TrackMixin,)  # Define the tuple of admin serializers here.

    class Meta:
        model = ElectionCommittees
        fields = "__all__"

class ElectionCommitteeResultsSerializer(TrackMixin, serializers.ModelSerializer):
    class Meta:
        model = ElectionCommitteeResults
        fields = "__all__"
