from rest_framework import serializers
from django.contrib.auth.models import User
from base.models import Job

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'

        read_only_fields = ['user']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        # This securely hashes the password before saving!
        user = User.objects.create_user(**validated_data)
        return user