from rest_framework.views import APIView
from rest_framework.response import Response
from restapi.serializers import *
from restapi.models import *

# Project Info
class ProjectInfo(APIView):
    def get(self, request):
        project_info = ProjectInfo.objects.all()
        serializer = ProjectInfoSerializer(project_info, many=True)
        return Response(serializer.data)
