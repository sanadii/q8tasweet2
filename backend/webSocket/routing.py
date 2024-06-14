from django.urls import path, re_path
from channels.routing import ProtocolTypeRouter, URLRouter, ChannelNameRouter

<<<<<<< HEAD
from webSocket.consumers.ElectionConsumer import ElectionConsumer
from webSocket.consumers.CampaignConsumer import CampaignConsumer, CampaignConsumer
from webSocket.consumers.NotificationConsumer import NotificationConsumer
from webSocket.consumers.GlobalConsumer import GlobalConsumer
=======
# from webSocket.consumers.ElectionConsumer import ElectionConsumer
# from webSocket.consumers.CampaignConsumer import CampaignConsumer, CampaignConsumer
# from webSocket.consumers.NotificationConsumer import NotificationConsumer
# from webSocket.consumers.GlobalConsumer import GlobalConsumer
>>>>>>> sanad

# from .consumers import consumers

websocket_urlpatterns = [
    
    # Global Channel
<<<<<<< HEAD
    path('ws/Global/', GlobalConsumer.as_asgi()),

    path('ws/election/<str:slug>/', ElectionConsumer.as_asgi()),
    path('ws/campaigns/<str:slug>/', CampaignConsumer.as_asgi()),
    path('ws/sorting/<str:slug>/', CampaignConsumer.as_asgi()),
    path('ws/notifications/', NotificationConsumer.as_asgi()),

    # Test
    path('ws/Client/', GlobalConsumer.as_asgi(), {'type': 'Client'}),
=======
    # path('ws/Global/', GlobalConsumer.as_asgi()),

    # path('ws/election/<str:slug>/', ElectionConsumer.as_asgi()),
    # path('ws/campaigns/<str:slug>/', CampaignConsumer.as_asgi()),
    # path('ws/sorting/<str:slug>/', CampaignConsumer.as_asgi()),
    # path('ws/notifications/', NotificationConsumer.as_asgi()),

    # # Test
    # path('ws/Client/', GlobalConsumer.as_asgi(), {'type': 'Client'}),
>>>>>>> sanad

]



# // General --
# // Notifications [ /ws/notifications ]
# // Chatting [ /ws/chat/uuid ]

# // Election -- [ ws/election/<str:socketUrl>/ ]
# // Sorting
# // Chatting

# Campaigns -- [ ws/campaigns/<str:socketUrl> ]
# - Notification    :   [ /ws/chat/campaignSlug ]
# Who can send notification?    Admin / Campaign Manager
# Who can send Listen?          All Campaign Members


# - Sort            :   ...
# who can sort? Sort
# where he can broadcast? campaign +/- election

# - Update          :   Guarantees/Attendees
# Who can update?               Admin, Managers, guarantors, attendants
# Who can listen?               Admin, Managers, guarantors, attendatnts
# Where is it broadcasting?     Campaign

# Chat              :   [ /ws/chat/campaignSlug ]
