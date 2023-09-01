from django.urls import path, re_path
from .views import *
from . import views

import os
import sys
# from django.views.generic import TemplateView

urlpatterns = [


    re_path(r'^$', views.index, name='index'),

    # re_path(r'upLoadImage', views.upLoadImage),
    # re_path(r'getImage/', views.getImage),


    # Project Info
    path('projectInfo', ProjectInfo.as_view(), name='projectInfo'),


    # Elections Main
    path('getElections', GetElections.as_view(), name='getElections'),
    path('getElections', GetElections.as_view(), name='getElections'),
    path('addNewElection', addNewElection.as_view(), name='addNewElection'),
    path('delElection/<int:id>', DelElection.as_view(), name='delElection'),
    path('updateElection/<int:id>',
         UpdateElection.as_view(), name='UpdateElection'),
    path('getElectionDetails/<int:id>',
         GetElectionDetails.as_view(), name='GetElectionDetails'),

    path('getElectionCount', GetElectionCount.as_view(), name='getElectionCount'),

    # Images
    path("uploadElectionImage", views.UploadElectionImage.as_view(), name="UploadElectionImage"),




    # re_path(r'getElectionDetails', views.getElectionDetails),
    # re_path(r'getElectionDetails/<int:election_id>/', views.getElectionDetails, name="getElectionDetails"),
    # path("getElectionDetails/<int:election_id>", views.getElectionDetails, name="getElectionDetails"),
]
