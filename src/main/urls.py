from django.contrib import admin
from django.urls import path, include
from rest_framework_jwt.views import obtain_jwt_token

urlpatterns = [
    path('admin/', admin.site.urls),
    path('token-auth/', obtain_jwt_token),
    path('users/', include('users.urls')),
    path('api/', include('gmail.urls')),
    path('userdata/', include('userdata.urls')),

    # must be at the bottom as it has a catch-all
    path('', include('frontend.urls')),
]
