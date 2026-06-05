from rest_framework import serializers
from base.models import Job

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        field = '__all__'