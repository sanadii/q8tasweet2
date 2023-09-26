from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import serializers, status
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.http.response import JsonResponse

from django.conf import settings
from .serializers import *
from .models import User

from rest_framework_simplejwt.views import TokenObtainPairView

import jwt, datetime
from datetime import datetime, timedelta
from django.contrib.auth.models import Group

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

@method_decorator(csrf_exempt, name='dispatch')
class userJWTLogin(APIView):
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

        user_data = UserJWTLoginSerializer(user).data

        return Response({
            'status': 'success',
            'refresh_token': str(refresh),
            'access_token': access_token,
            'data': user_data
        })
    

class AddNewUser(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
        group = Group.objects.get(name='Moderator')

        # Get the users in the group 'Moderator'
        moderators = group.user_set.all()

        # Serialize the data
        data_serializer = UserSerializer(moderators, many=True)

        return Response({"data": data_serializer.data, "code": 200})

class GetCurrentUser(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # The user is already authenticated, so you can access the user directly from the request
        user = request.user

        # Serialize the user
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


# class userJWTLogin(APIView):
#     def post(self, request):
#         email = request.data.get('email')
#         password = request.data.get('password')

#         # Assuming your User model has an email field
#         user = User.objects.filter(email=email).first()

#         if user is None:
#             return Response({'detail': 'User not found!'}, status=status.HTTP_401_UNAUTHORIZED)

#         if not user.check_password(password):
#             return Response({'detail': 'Incorrect password!'}, status=status.HTTP_401_UNAUTHORIZED)

#         payload = {
#             'id': user.id,
#             'exp': datetime.utcnow() + timedelta(minutes=60),
#             'iat': datetime.utcnow()
#         }

#         # Store the secret key in settings.py and get it from there
#         token = jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm='HS256')

#         response = Response()
#         response.set_cookie(key='token', value=token, httponly=True)
        
#         user_data = UserJWTLoginSerializer(user).data  # serialize user object to get data

#         # Modify the response to include the user and token
#         response.data = {
#             'status': 'success',
#             'token': token,
#             'data': user_data
#         }

#         return response