from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/campaigns/<str:slug>/', consumers.CampaignSortingConsumer.as_asgi()),
]