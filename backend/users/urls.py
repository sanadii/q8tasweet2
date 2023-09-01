# Users urls.py
from django.urls import path, include
from .views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

app_name = "users"

urlpatterns = [
    # Authentication
    path("", include("restapi.urls", namespace="restapi")),
    path("auth/userJWTLogin", userJWTLogin.as_view(), name="userJWTLogin"),
    path("post-jwt-profile/", UserProfileUpdateAPIView.as_view(), name="user_profile_update"),
    # path("user/", UserCreate.as_view(), name="listpost"),
    path("auth/", include("rest_framework.urls", namespace="rest_framework")),

    # path("user/", include("users.urls", namespace="users")),
    # path("create/", UserCreate.as_view(), name="create_user"),
    # path("logout/blacklist/", BlacklistTokenUpdateView.as_view(), name="blacklist"),
    
    # Tokens
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),

    # Users
    path("users/getUsers", GetUsers.as_view(), name="GetUsers"),
    path("users/getModeratorUsers", GetModeratorUsers.as_view(), name="GetModeratorUsers"),
    path('users/getCurrentUser', GetCurrentUser.as_view(), name="GetCurrentUser"),
    path('users/addNewUser', AddNewUser.as_view(), name="AddNewUser"),
    path('users/deleteUser/<int:id>', DeleteUser.as_view(), name="DeleteUser"),
]
