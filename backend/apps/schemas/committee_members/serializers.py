# Committee Members
# elections/serializers.py
from rest_framework import serializers

# Models
from apps.schemas.committee_members.models import CommitteeAgent, CommitteeDelegate


# # Votting and Sorting
class CommitteeAgentSerializer(serializers.ModelSerializer):

    class Meta:
        model = CommitteeAgent
        fields = "__all__"
        # fields = ["committee", "election_candidate", "votes"]

class CommitteeDelegateSerializer(serializers.ModelSerializer):

    class Meta:
        model = CommitteeDelegate
        fields = "__all__"
        # fields = ["committee", "election_candidate", "votes"]


