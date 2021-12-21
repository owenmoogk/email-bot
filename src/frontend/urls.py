from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('login/', index),
    path('signup/', index),
    path('compose/', index),
    path('contacts/', index),
    path('templates/', index)
]