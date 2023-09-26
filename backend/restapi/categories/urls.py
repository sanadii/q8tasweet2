# Campaign Urls

from django.urls import path
from .views import *

app_name = "restapi"

urlpatterns = [
    # Terms
    path("getCategories", GetCategories.as_view(), name="GetCategories"),
    path("updateCategory/<int:id>", UpdateCategory.as_view(), name="UpdateCategory"),
]