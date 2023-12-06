from django.urls import path
from webSocket.consumers.ElectionConsumer import ElectionConsumer
from webSocket.consumers.SortingConsumer import SortingConsumer
from webSocket.consumers.NotificationConsumer import NotificationConsumer
from webSocket.consumers.GlobalConsumer import GlobalConsumer
# from .consumers import consumers

# // General --
# // Notifications [ /ws/notifications ]
# // Chatting [ /ws/chat/uuid ]

# // Election -- [ ws/election/<str:socketUrl>/ ]
# // Sorting
# // Chatting

# // Campaigns -- [ ws/campaigns/<str:socketUrl> ]
# // Sorting Votes
# // Updating Guarantees/Attendees
# // Chatting [ /ws/chat/campaignSlug ]

websocket_urlpatterns = [
    path('ws/election/<str:slug>/', ElectionConsumer.as_asgi()),
    path('ws/campaigns/<str:slug>/', SortingConsumer.as_asgi()),
    path('ws/sorting/<str:slug>/', SortingConsumer.as_asgi()),
    path('ws/notifications/', NotificationConsumer.as_asgi()),

    # Test
    path('ws/GlobalChannel/<str:channel>/', GlobalConsumer.as_asgi()),
    path('ws/GlobalChannel/', GlobalConsumer.as_asgi()),
]
