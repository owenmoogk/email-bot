from django.apps import AppConfig

class GmailConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'gmail'

    def ready(self):
        from .views import startScheduler
        startScheduler()
