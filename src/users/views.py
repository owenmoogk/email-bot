from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response

from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout

class Login(APIView):
    def post(self, request):
        user = authenticate(username = request.data['username'], password = request.data['password'])

        if user is not None:
            login(request, user)
            return Response({'status': 'success'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'credentials failed'}, status=status.HTTP_401_UNAUTHORIZED)

class Logout(APIView):
    def get(self, request):
        logout(request)
        return Response({'success': 'yay'}, status=status.HTTP_200_OK)

class Signup(APIView):
    def post(self, request):
        try:
            user = User.objects.create_user(request.data['username'], '', request.data['password'])
        except Exception as e:
            return Response({'error':'Username taken'}, status=status.HTTP_400_BAD_REQUEST)

        user.save()

        login(request, user)

        return Response({}, status=status.HTTP_200_OK)

