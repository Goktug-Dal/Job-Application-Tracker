from rest_framework.response import Response
from rest_framework.decorators import api_view

from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes

from rest_framework.permissions import IsAuthenticated

from base.models import Job
from .serializers import JobSerializer

from django.shortcuts import get_object_or_404

from rest_framework import status

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

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def editJob(request, id):
    job = get_object_or_404(Job, id = id, user = request.user)
    serializer = JobSerializer(job, data = request.data, partial = True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status = 400)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteJob(request,id):
    try:
        job = Job.objects.get(id = id, user = request.user)
        job.delete()
        return Response({"message": "Job deleted successfully"}, status=status.HTTP_200_OK)
    except Job.DoesNotExist:
        return Response({"error": "Job not found"}, status=status.HTTP_404_NOT_FOUND)