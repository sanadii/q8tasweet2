from rest_framework import serializers
from restapi.models import Candidates, User
from restapi.base_serializer import AdminControlSerializer, TrackingSerializer


class CandidatesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidates
        fields = '__all__'  # Assuming you want to potentially include all fields in Candidates model

    # def to_representation(self, instance):
    #     request = self.context.get('request')
        
    #     # If the request has a user and the user is a staff member, 
    #     # use the AdminControlSerializer for representation
    #     if request and request.user and request.user.is_staff:
    #         return AdminControlSerializer(instance, context=self.context).data
        
    #     # Otherwise, use the TrackingSerializer for representation
    #     return CandidatesSerializer
