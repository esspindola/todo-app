from django_filters.rest_framework import DjangoFilterBackend, FilterSet, DateFilter
from rest_framework import viewsets, permissions
from .models import Task
from .serializers import TaskSerializer


class TaskFilter(FilterSet):
    created_at_after = DateFilter(field_name="created_at", lookup_expr="gte")
    created_at_before = DateFilter(field_name="created_at", lookup_expr="lte")

    class Meta:
        model = Task
        fields = ["done", "title", "description"]


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = TaskFilter

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
