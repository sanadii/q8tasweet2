from django.urls import path, re_path
from channels.routing import ProtocolTypeRouter, URLRouter, ChannelNameRouter

from webSocket.consumers.ElectionConsumer import ElectionConsumer
from webSocket.consumers.SortingConsumer import SortingConsumer
from webSocket.consumers.NotificationConsumer import NotificationConsumer
from webSocket.consumers.GlobalConsumer import GlobalConsumer, TestConsumer, PersonalChatConsumer

# from .consumers import consumers

websocket_urlpatterns = [
    path('ws/election/<str:slug>/', ElectionConsumer.as_asgi()),
    path('ws/campaigns/<str:slug>/', SortingConsumer.as_asgi()),
    path('ws/sorting/<str:slug>/', SortingConsumer.as_asgi()),
    path('ws/notifications/', NotificationConsumer.as_asgi()),

    # Test
    path('ws/GlobalChannel/<str:channel>/', GlobalConsumer.as_asgi()),
    path('ws/Global/', GlobalConsumer.as_asgi(), {'type': 'Global'}),
    path('ws/Client/', GlobalConsumer.as_asgi(), {'type': 'Client'}),

    # Test
    # re_path(r'ws/Test/', TestConsumer.as_asgi()),
    # path('ws/chat/<int:id>/', PersonalChatConsumer.as_asgi()),
]



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
