from rest_framework import permissions, status
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework_jwt.settings import api_settings
from django.contrib.auth.models import User
from django.http import JsonResponse
from rest_framework_simplejwt.tokens import AccessToken


@api_view(['GET'])
def current_user(request):
    return JsonResponse({'username': request.user.username})


class Signup(APIView):

    permission_classes = (permissions.AllowAny,)

    def post(self, request):

        # CREATING USER
        if not request.data['username'] or not request.data['password']:
            return JsonResponse(
                {"error": "Field may not be empty"}, status=status.HTTP_400_BAD_REQUEST
            )
        if User.objects.filter(username = request.data['username']).exists():
            return JsonResponse(
                {"Error": "A user with this username already exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        new_user = User(username = request.data['username'])
        new_user.set_password(request.data['password'])
        new_user.save()

        token = AccessToken.for_user(new_user)
        
        return JsonResponse({"token": str(token), "username": new_user.username})
        