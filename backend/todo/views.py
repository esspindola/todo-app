from django_filters.rest_framework import (
    DjangoFilterBackend,
    FilterSet,
    DateFilter,
    BooleanFilter,
    CharFilter,
)
from django.db import models
from rest_framework import viewsets, permissions
from .models import Task
from .serializers import TaskSerializer


class TaskFilter(FilterSet):
    created_at_after = DateFilter(field_name="created_at", lookup_expr="gte")
    created_at_before = DateFilter(field_name="created_at", lookup_expr="lte")
    search = CharFilter(method="filter_search")

    class Meta:
        model = Task
        fields = ["done", "title", "description"]

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            models.Q(title__icontains=value) | models.Q(description__icontains=value)
        )


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = TaskFilter

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
