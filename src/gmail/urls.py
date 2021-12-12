from django.contrib import admin
from django.urls import path, include

from .views import *

urlpatterns = [
    path('send/', ExecuteGmailRequest.as_view()),
    path('auth/', Authorize.as_view()),
    path('oauth2callback/', Callback.as_view()),
    path('schedule/', Schedule.as_view())
]
