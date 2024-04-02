from django.http.response import JsonResponse
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ObjectDoesNotExist
import jwt

from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework.views import APIView

from .models import Group, GroupCategories
from .serializers import UserSerializer, UserLoginSerializer, ContentTypeSerializer, GroupPermissionSerializer, GroupSerializer, UserImageSerializer


from utils.views import get_current_user_campaigns 
# from utils.auths import generate_username
from django.core.mail import send_mail,EmailMultiAlternatives
from django.utils.crypto import get_random_string
from django.contrib.auth.hashers import make_password

import random
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils import timezone
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from rest_framework.parsers import MultiPartParser
import os
from django.core.files.storage import FileSystemStorage

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




User = get_user_model()

class UserRegister(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        #return Response({'msg':"Api Called!"})
        # Extract username from email or generate a new one
        email = request.data.get('email')
        username = self.generate_username(email)
        request.data['username'] = username

        serializer = UserSerializer(data=request.data, context={'request': request})
        if serializer.is_valid(): 
            # Pass 'created_by' as an argument to the save method
            new_user = serializer.save(created_by=None)
            return Response({
                "data": UserSerializer(new_user, context={'request': request}).data,
                "count": 1,
                "code": 200
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def generate_username(self, email):
        base_username = email.split('@')[0]
        username = base_username
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{random.randint(1, 99)}"
        return username


class ChangeUserPassword(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not user.check_password(old_password):
            return Response({'error': 'كلمة المرور السابقة غير صحيحة.'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({'status': 'password set'}, status=status.HTTP_200_OK)

class UpdateProfile(APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request):
        user = request.user  # Get the authenticated user directly from the request due to the middleware
        serializer = UserSerializer(user, data=request.data, partial=True) # Update existing instance
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True, "message": "User profile updated successfully"})
        return Response({"success": False, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
class UpdateProfileImage(APIView):
    parser_classes = (MultiPartParser,)

    def post(self, request, *args, **kwargs):
        serializer = UserImageSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'msg': 'User image updated!','status': status.HTTP_200_OK,})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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

from helper.views_helper import CustomPagination

class GetUsers(APIView):
    def get(self, request, *args, **kwargs):
        user_data = User.objects.all()
        paginator = CustomPagination()
        paginated_users = paginator.paginate_queryset(user_data, request)

        # Passing context with request to the serializer
        context = {"request": request}
        data_serializer = UserSerializer(paginated_users, many=True, context=context)

        return paginator.get_paginated_response(data_serializer.data)

class GetCurrentUser(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        user_data = UserSerializer(user).data

        # Get Related Campaigns. TODO: to be changed later for get Favourite // GetRelated Election / Campaigns
        campaigns = get_current_user_campaigns(user)  # Call the function
        user_data["campaigns"] = campaigns

        return Response({"data": user_data, "code": 200})
    
class GetModeratorUsers(APIView):
    def get(self, request):
        # Get the group object for 'Moderator'
        group = Group.objects.get(name='CampaignModerator')

        # Get the users in the group 'Moderator' - ID is 14
        moderators = group.user_set.all()

        # Serialize the data
        data_serializer = UserSerializer(moderators, many=True)

        return Response({"data": data_serializer.data, "code": 200})

class GetCampaignModerators(APIView):
    def get(self, request):
        try:
            # Get the group object where name is 'campaignModerator' (or 'Editor' if it's the correct name)
            group = Group.objects.get(name='moderator')  # Update 'campaignModerator' if needed

            # Get the users in the group with name 'campaignModerator'
            moderators = group.user_set.all()
            
            # Serialize the data
            data_serializer = UserSerializer(moderators, many=True)

            return Response({"data": data_serializer.data, "code": 200})
        except ObjectDoesNotExist:
            return Response({"data": [], "code": 200, "message": "No moderators found."})
    

class GetCampaignSorters(APIView):
    def get(self, request):
        try:
            # Get the group object where name is 'campaignModerator' (or 'Editor' if it's the correct name)
            group = Group.objects.get(name='moderator')  # Update 'campaignModerator' if needed
            
            # Get the users in the group with name 'campaignModerator'
            moderators = group.user_set.all()
            
            # Serialize the data
            data_serializer = UserSerializer(moderators, many=True)

            return Response({"data": data_serializer.data, "code": 200})
        except ObjectDoesNotExist:
            return Response({"data": [], "code": 200, "message": "No moderators found."})
        

    
class AddNewUser(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = UserSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            new_user = serializer.save()
            if 'password' in request.data:
                password = request.data['password']
                new_user.set_password(password)
                new_user.save()
            return Response({"data": UserSerializer(new_user, context={'request': request}).data, "count": 1, "code": 200}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateUser(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        if 'password' in request.data:
            if request.user != user and not request.user.is_superuser:
                return Response({"error": "You do not have permission to change this user's password."}, status=403)
            password = request.data.pop('password')
            user.set_password(password)

        serializer = UserSerializer(user, data=request.data, context={'request': request}, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data, "count": 0, "code": 200})
        return Response(serializer.errors, status=400)

class DeleteUser(APIView):
    def delete(self, request, id):
        try:
            user = User.objects.get(id=id)
            # user.delete(user=request.user) #This to use deleted by in TrackModel
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


class GetGroupPermissions(APIView):

    def get(self, request):
        # Fetch permissions, groups, and content types
        permissions = Permission.objects.all()
        groups = Group.objects.all()
        content_types = ContentType.objects.all()

        # Serialize permissions, groups, and content types
        permissions_serializer = GroupPermissionSerializer(permissions, many=True)
        groups_serializer = GroupSerializer(groups, many=True)
        content_types_serializer = ContentTypeSerializer(content_types, many=True)

        # Fetch all distinct categories and transform to desired format
        raw_categories = dict(GroupCategories.choices)
        categories = [{'id': key, 'name': value} for key, value in raw_categories.items()]

        # Return the response in the desired format
        return Response({
            "code": 200,
            "data": {
                "contentTypes": content_types_serializer.data,
                "permissions": permissions_serializer.data,
                "groups": groups_serializer.data,
                "categories": categories
            }
        })

#---- Reset password Api's 29-03-2024 --      
class ForgotPassword(APIView):
    #authentication_classes = []  # Remove authentication
    permission_classes = [AllowAny]
    def post(self,request):
        try:
            email = request.data.get('email')
            user = User.objects.filter(email=email).first()
            if user is None:
                response_data = {
                    'success': False,
                    'status':status.HTTP_404_NOT_FOUND,
                    'msg': 'Email not registered',
                }
                return Response(response_data, status=status.HTTP_404_NOT_FOUND)
            else:
                #otp = random.randint(1000, 9999)
                #token = get_random_string(length=32)
                token_generator = PasswordResetTokenGenerator()
                token = token_generator.make_token(user)
                expiry_time = timezone.now() + timezone.timedelta(hours=1)
                #expiry_time = timezone.now() + timezone.timedelta(minutes=5)
                subject, from_email, to = 'Password Reset', 'shankar.wxit@gmail.com', email
                #text_content = 'This is an important message.'
                msg = f'Click the link to reset your password: http://localhost:3000/reset-password/{token}'
                msg1 = EmailMultiAlternatives(subject, msg, from_email, [to])
                msg1.content_subtype = 'html'
                msg1.send()
               
                User.objects.filter(id=user.id).update(token=token,token_expiry=expiry_time)
                response_data = {
                    'success': True,
                    'msg': 'Password reset email sent!',
                    'status':status.HTTP_200_OK
                }
                return Response(response_data, status=status.HTTP_200_OK)
           
        except Exception as e:
            response_data = {
                'success': False,
                'msg': f'{str(e)}',
                'status':status.HTTP_500_INTERNAL_SERVER_ERROR
            }
            return Response(response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class ResetPassword(APIView):
    permission_classes = [AllowAny]
    def post(self,request):
        try:
            password = request.data.get('password')
            cpassword = request.data.get('cpassword')
            token = request.data.get('token')
            user = User.objects.filter(token=token).first()
            
            if user is None:
                response_data = {
                    'success': False,
                    'status':status.HTTP_404_NOT_FOUND,
                    'msg': 'Token not registered',
                }
                return Response(response_data, status=status.HTTP_404_NOT_FOUND)
            if password != cpassword:
                response_data = {
                    'success': False,
                    'status':status.HTTP_404_NOT_FOUND,
                    'msg': 'Confirm Password Not Matched !',
                }
                return Response(response_data, status=status.HTTP_404_NOT_FOUND)
            # Check if token has expired
            if user.token_expiry and user.token_expiry < timezone.now():
                response_data = {
                    'success': False,
                    'status': status.HTTP_400_BAD_REQUEST,
                    'msg': 'Token has expired',
                }
                return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
            
            if token != user.token:
                response_data = {
                    'success': False,
                    'status':status.HTTP_404_NOT_FOUND,
                    'msg': 'Token Not Matched !',
                }
                return Response(response_data, status=status.HTTP_404_NOT_FOUND)
            else:
                token = ' '
                User.objects.filter(id=user.id).update(token=token)
                # Hash the password
                hashed_password = make_password(password)
                user.password = hashed_password
                user.token = token
                
                # Save the user object
                user.save()
                response_data = {
                    'success': True,
                    'msg': 'Your password has been updated !',
                    'status':status.HTTP_200_OK
                }
                return Response(response_data, status=status.HTTP_200_OK)
           
        except Exception as e:
            response_data = {
                'success': False,
                'msg': f'{str(e)}',
                'status':status.HTTP_500_INTERNAL_SERVER_ERROR
            }
            return Response(response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        