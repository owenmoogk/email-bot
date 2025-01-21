from django.contrib import admin
from django.urls import path, include

from .templateViews import *
from .contactViews import *

urlpatterns = [
    path('addtemplate/', AddTemplate.as_view()),
    path('templates/', GetTemplates.as_view()),
    path('template/<int:id>/', GetTemplate.as_view()),
    path('template/edit/<int:id>/', EditTemplate.as_view()),
    path('template/delete/<int:id>/', DeleteTemplate.as_view()),

    path('addcontact/', AddContact.as_view()),
    path('contacts/', GetContacts.as_view()),
    path('contact/<int:id>/', GetContact.as_view()),
    path('contact/edit/<int:id>/', EditContact.as_view()),
    path('contact/delete/<int:id>/', DeleteContact.as_view())
]
