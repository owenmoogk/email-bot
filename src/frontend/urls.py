from django.urls import include, path
from .views import index

accountUrls = [
    path('login/', index),
    path('logout/', index),
    path('signup/', index)
]

urlpatterns = [
    path('accounts/', include(accountUrls)),
    path('', index, name=''),
]