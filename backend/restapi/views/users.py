from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


from rest_framework import serializers
from .serializers import UserSerializer

from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny, IsAuthenticated


from .models import User
import jwt, datetime
from datetime import datetime, timedelta

class LoginView(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']

        # Assuming your User model has an email field
        username = User.objects.filter(email=email).first()

        if username is None:
            raise AuthenticationFailed('User not found!')

        if not username.check_password(password):
            raise AuthenticationFailed('Incorrect password!')

        payload = {
            'id': username.id,
            'exp': datetime.utcnow() + timedelta(minutes=60),
            'iat': datetime.utcnow()
        }

        token = jwt.encode(payload, 'secret', algorithm='HS256')

        response = Response()
        response.set_cookie(key='jwt', value=token, httponly=True)
        
        # Modify the response to include the user and token
        response.data = {
            'jwt': token,
            'user': username.username,  # Modify this based on your User model fields
            'first_name': username.first_name,  # Modify this based on your User model fields
        }

        return response

class UserCreate(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format='json'):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                json = serializer.data
                return Response(json, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=255)

class UserProfileUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, format=None):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user  # Get the authenticated user
            first_name = serializer.validated_data.get("first_name")  # Get the updated first name from the serializer data

            user.first_name = first_name  # Update the user's first name
            user.save()  # Save the user object

            return Response({"success": True, "message": "User profile updated successfully"})
        else:
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
