from rest_framework import serializers
from .models import Task
from dj_rest_auth.registration.serializers import RegisterSerializer


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = "__all__"


class CustomRegisterSerializer(RegisterSerializer):
    def get_cleaned_data(self):
        return super().get_cleaned_data()
