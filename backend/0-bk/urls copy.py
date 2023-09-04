from django.urls import path, re_path
from . import views
from elections import views

import os, sys
# from django.views.generic import TemplateView

urlpatterns = [

    # re_path(r'^$', TemplateView.as_view(template_name='index.html')),

    re_path(r'^$', views.index, name='index'),

    re_path(r'upLoadImage', views.upLoadImage),
    re_path(r'getImage/', views.getImage),
    
    # Elections Main
    path('getElections', views.getElections, name='getElections'),
    path('addElection', views.addElection, name='addElection'),
    path('delElection/<int:id>', views.delElection, name='delElection'),
    path('updateElection/<int:id>', views.updateElection, name='updateElection'),

    path('getElectionCount', views.getElectionCount, name='getElectionCount'),


    # re_path(r'getElectionDetails', views.getElectionDetails),
    # re_path(r'getElectionDetails/<int:election_id>/', views.getElectionDetails, name="getElectionDetails"),
    path("getElectionDetails/<int:election_id>", views.getElectionDetails, name="getElectionDetails"),
   
   
    path("uploadElectionImage", views.UploadElectionImage, name="UploadElectionImage"),
    
    # re_path(r'getElection', views.getElection),

    # re_path(r'delElection/<int:id>/', views.delElection),
    # re_path(r'updateElection', views.updateElection),

    # User Elections
    re_path(r'getUserElection/', views.getUserElection),
    re_path(r'getUpElection', views.getUpElection),
    re_path(r'getPrev5Election', views.getPrev5Election),
    re_path(r'getElectionId/', views.getElectionId),
    re_path(r'getCountCandidate/', views.getCountCandidate),

    #
    re_path(r'getUserTeamCount/', views.getUserTeamCount),
    re_path(r'getSupervisorTeamCount/', views.getSupervisorTeamCount),
    #
    re_path(r'getMyGuanatorId/', views.getMyGuanatorId),
    re_path(r'delMyGuanatorId/', views.delMyGuanatorId),
    re_path(r'addMyGuanatorId', views.addMyGuanatorId),
    #
    re_path(r'getGuaranteesCount/', views.getGuaranteesCount),
    re_path(r'getUserId/', views.getUserId),
    re_path(r'getIdUser', views.getIdUser),
    #
    re_path(r'getMyCandidateId/', views.getMyCandidateId),
    re_path(r'getCandidateElection/', views.getCandidateElection),
    re_path(r'addMyCandidateId', views.addMyCandidateId),
    #
    re_path(r'getElectionCandidate/', views.getElectionCandidate),
    re_path(r'getElectionCandidateId/', views.getElectionCandidateId),
    re_path(r'getElectionCount/', views.getElectionCount),

    # Menu
    re_path(r'getMenu', views.getMenu),
    re_path(r'updateMenu', views.updateMenu),
    re_path(r'delMenu/', views.delMenu),
    re_path(r'addMenu', views.addMenu),
    # re_path(r'updateMenu', views.updateMenu),

    # Permissions
    re_path(r'getPermission/', views.getPermission),
    re_path(r'addPermission', views.addPermission),
    re_path(r'updatePermission', views.updatePermission),
    re_path(r'delPermission/', views.delPermission),
    #
    re_path(r'getAllPermission', views.getAllPermission),

    # Roles
    re_path(r'getRole/', views.getRole),
    re_path(r'addRole', views.addRole),
    re_path(r'updateRole', views.updateRole),
    re_path(r'delRole/', views.delRole),
    #
    re_path(r'getAllRole', views.getAllRole),

    # Ranks
    re_path(r'getRank/', views.getRank),
    re_path(r'addRank', views.addRank),
    re_path(r'updateRank', views.updateRank),
    re_path(r'delRank/', views.delRank),
    #
    re_path(r'getAllRank', views.getAllRank),

    # Users
    re_path(r'getUser/', views.getUser),
    re_path(r'getallUser/', views.getallUser),
    re_path(r'addUser', views.addUser),
    re_path(r'updateUser', views.updateUser),
    path('delUser/<int:id>/', views.delUser),
    # re_path(r'delUser/', views.delUser),


    # Teams
    re_path(r'getMyTeamId/', views.getMyTeamId),
    re_path(r'addMyTeamId', views.addMyTeamId),
    # re_path(r'updateUser', views.updateUser),
    re_path(r'delMyTeamId/', views.delMyTeamId),
]
