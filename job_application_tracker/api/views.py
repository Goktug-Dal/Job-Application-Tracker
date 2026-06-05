from rest_framework.response import Response
from rest_framework.decorators import api_view

from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes

from rest_framework.permissions import IsAuthenticated

from base.models import Job
from .serializers import JobSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getAll(request):
    job = Job.objects.filter(user = request.user)
    serializer = JobSerializer(job, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createJob(request):
    serializer = JobSerializer(data = request.data)

    if serializer.is_valid():
        serializer.save(user = request.user)
        return Response(serializer.data)
    return Response(serializer.errors, status = 400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def editJob(request, id):
    job = Job.objects.get(id = id, user = request.user)
    serializer = JobSerializer(job, data = request.data, partial = True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status = 400)