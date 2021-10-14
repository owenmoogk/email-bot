from django.urls import include, path
from .views import index

urlpatterns = [
    path('login/', index),
    path('signup/', index),
    path('', index, name=''),
]