# auth/urls.py
from django.urls import path, include
from .views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

app_name = "users"
<<<<<<< HEAD

urlpatterns = [
    # Authentication
    path("userLogin", UserLogin.as_view(), name="UserLogin"),
    path("userRegister", UserRegister.as_view(), name="UserRegister"),

    
    path("postProfile/", UserProfileUpdateAPIView.as_view(), name="user_profile_update"),
    # path("user/", UserCreate.as_view(), name="listpost"),
    path("auth/", include("rest_framework.urls", namespace="rest_framework")),
=======
 
urlpatterns = [ 
    # Authentication
    path("auth/", include("rest_framework.urls", namespace="rest_framework")),
    path("userLogin", UserLogin.as_view(), name="UserLogin"),
    path("userRegister", UserRegister.as_view(), name="UserRegister"),

    # --Comment Before ----
    # path("postProfile/", UpdateProfile.as_view(), name="user_profile_update"),

    # New Url for Update Profile ---
    #path('update-profile',UpdateProfile.as_view(),name="update-profile"),
    # path('uploadImage',UpdateProfileImage.as_view(),name="uploadImage"),
    # path("user/", UserCreate.as_view(), name="listpost"),
    # path("auths/", include("auths.urls", namespace="rest_framework")),
>>>>>>> sanad

    # path("user/", include("users.urls", namespace="users")),
    # path("create/", UserCreate.as_view(), name="create_user"),
    # path("logout/blacklist/", BlacklistTokenUpdateView.as_view(), name="blacklist"),
<<<<<<< HEAD
    

    # Users
    path("getUsers", GetUsers.as_view(), name="GetUsers"),
    path('addNewUser', AddNewUser.as_view(), name="AddNewUser"),
    path('updateUser/<int:id>', UpdateUser.as_view(), name="UpdateUser"),
    path('deleteUser/<int:id>', DeleteUser.as_view(), name="DeleteUser"),
    path('changeUserPassword/<int:id>', ChangeUserPassword.as_view(), name="ChangeUserPassword"),
=======
    path('updateUserProfile', UpdateUserProfile.as_view(), name="UpdateUser"),
    
    #------ Forgot password ------
    path('forgotPassword',ForgotPassword.as_view(),name="ForgotPassword"),
    path('resetPassword',ResetPassword.as_view(),name="ResetPassword"),


    # Tokens
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),


    # Users
    path("getUsers", GetUsers.as_view(), name="GetUsers"),
    path('addUser', AddUser.as_view(), name="AddUser"),
    path('updateUser/<int:id>', UpdateUser.as_view(), name="UpdateUser"),
    path('deleteUser/<int:id>', DeleteUser.as_view(), name="DeleteUser"),
>>>>>>> sanad


    # Specific Users
    path('getCurrentUser', GetCurrentUser.as_view(), name="GetCurrentUser"),
    path("getModeratorUsers", GetModeratorUsers.as_view(), name="GetModeratorUsers"),
    path("getCampaignModerators", GetCampaignModerators.as_view(), name="GetCampaignModerators"),
    path("getCampaignSorters", GetCampaignSorters.as_view(), name="GetCampaignSorters"),


    # Groups
    path("getGroups", GetGroups.as_view(), name="GetGroups"),
<<<<<<< HEAD
    path('addNewGroup', AddNewGroup.as_view(), name="AddNewGroup"),
    path('updateGroup', UpdateGroup.as_view(), name="UpdateGroup"),
    path('deleteGroup/<int:id>', DeleteGroup.as_view(), name="DeleteGroup"),

    # Permissions
    path("getGroupPermissions", GetGroupPermissions.as_view(), name="GetGroupPermissions"),
    path('addNewGroup', AddNewGroup.as_view(), name="AddNewGroup"),
=======
    path('addGroup', AddGroup.as_view(), name="AddGroup"),
    path('updateGroup', UpdateGroup.as_view(), name="UpdateGroup"),
    path('deleteGroup/<int:id>', DeleteGroup.as_view(), name="DeleteGroup"),


    # Permissions
    path("getGroupPermissions", GetGroupPermissions.as_view(), name="GetGroupPermissions"),
    path('addGroup', AddGroup.as_view(), name="AddGroup"),
>>>>>>> sanad
    path('updateGroup', UpdateGroup.as_view(), name="UpdateGroup"),
    path('deleteGroup/<int:id>', DeleteGroup.as_view(), name="DeleteGroup"),



    # Tokens
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),

<<<<<<< HEAD
=======


>>>>>>> sanad
]
