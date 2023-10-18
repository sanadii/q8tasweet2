from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.http.response import JsonResponse
from restapi.serializers import *

from restapi.models import User
from django.contrib.auth.models import Group
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from restapi.auth.models import GroupCategories
from django.core.exceptions import ObjectDoesNotExist

@method_decorator(csrf_exempt, name='dispatch')
class UserLogin(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = User.objects.filter(email=email).first() # Assuming your User model has an email field

        if user is None:
            return Response({'error': 'User not found!'}, status=status.HTTP_404_NOT_FOUND)
        if not user.check_password(password):
            return Response({'error': 'Incorrect password!'}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)
        access_token = str(AccessToken().for_user(user))

        user_data = UserLoginSerializer(user).data

        return Response({
            'status': 'success',
            'refresh_token': str(refresh),
            'access_token': access_token,
            'data': user_data
        })


class UserProfileUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, format=None):
        user = request.user  # Get the authenticated user directly from the request due to the middleware
        serializer = UserSerializer(user, data=request.data, partial=True) # Update existing instance
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True, "message": "User profile updated successfully"})
        return Response({"success": False, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class BlacklistTokenUpdateView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = ()

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class GetUsers(APIView):
    def get(self, request):
        data_data = User.objects.all()
        data_serializer = UserSerializer(data_data, many=True)
        return Response({"data": data_serializer.data, "code": 200})

class GetModeratorUsers(APIView):
    def get(self, request):
        # Get the group object for 'Moderator'
        group = Group.objects.get(role='CampaignModerator')

        # Get the users in the group 'Moderator' - ID is 14
        moderators = group.user_set.all()

        # Serialize the data
        data_serializer = UserSerializer(moderators, many=True)

        return Response({"data": data_serializer.data, "code": 200})

class GetCampaignModerators(APIView):
    def get(self, request):
        try:
            # Get the group object where role is 'campaignModerator' (or 'Editor' if it's the correct role)
            group = Group.objects.get(role='moderator')  # Update 'campaignModerator' if needed
            
            # Get the users in the group with role 'campaignModerator'
            moderators = group.user_set.all()
            
            # Serialize the data
            data_serializer = UserSerializer(moderators, many=True)

            return Response({"data": data_serializer.data, "code": 200})
        except ObjectDoesNotExist:
            return Response({"data": [], "code": 200, "message": "No moderators found."})
    
class AddNewUser(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateUser(APIView):
    def patch(self, request, id):
        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            return Response({"data": "User not found", "code": 404}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetCurrentUser(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_data = UserSerializer(user).data
        return Response({"data": user_data, "code": 200})

class DeleteUser(APIView):
    def delete(self, request, id):
        try:
            user = User.objects.get(id=id)
            user.delete()
            return JsonResponse({"data": "User deleted successfully", "count": 1, "code": 200}, safe=False)
        except User.DoesNotExist:
            return JsonResponse({"data": "User not found", "count": 0, "code": 404}, safe=False)


# Group Model
class GetGroups(APIView):

    def get(self, request):
        groups = Group.objects.all()
        serializer = GroupSerializer(groups, many=True)

        # Fetch all distinct categories and transform to desired format
        raw_categories = dict(GroupCategories.choices)
        categories = [{'id': key, 'name': value} for key, value in raw_categories.items()]

        # Return the response in the desired format
        return Response({
            "code": 200,
            "data": {
                "groups": serializer.data,
                "categories": categories
            }
        })

class AddNewGroup(APIView):
    def post(self, request):
        serializer = GroupSerializer(data=request.data)
        if serializer.is_valid():
            group = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateGroup(APIView):
    def patch(self, request, id):
        try:
            group = Group.objects.get(id=id)
        except Group.DoesNotExist:
            return Response({"data": "Group not found", "code": 404}, status=status.HTTP_404_NOT_FOUND)

        serializer = GroupSerializer(group, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteGroup(APIView):
    def delete(self, request, id):
        try:
            group = Group.objects.get(id=id)
            group.delete()
            return JsonResponse({"data": "Group deleted successfully", "count": 1, "code": 200}, safe=False)
        except Group.DoesNotExist:
            return JsonResponse({"data": "Group not found", "count": 0, "code": 404}, safe=False)
