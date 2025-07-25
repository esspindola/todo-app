from django.apps import AppConfig


class TodoConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "todo"

    def ready(self):
        from dj_rest_auth.registration.serializers import RegisterSerializer

        RegisterSerializer._has_phone_field = False
