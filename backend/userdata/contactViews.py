from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework import status

from .models import Contact

class AddContact(APIView):

    def post(self, request):

        data = request.data

        if 'name' in data and 'email' in data and 'variables' in data:
            Contact.objects.create(info=data, user=request.user)

            return Response({}, status=status.HTTP_200_OK)
        else:
            return Response({}, status=status.HTTP_400_BAD_REQUEST)


class EditContact(APIView):

    def post(self, request, id):

        data = request.data

        if not (data['name'] and data['email']):
            return Response({}, status=status.HTTP_400_BAD_REQUEST)

        contact = Contact.objects.get(id = id)

        if contact.user == request.user:
            contact.info = data
            contact.save()
            return Response({}, status=status.HTTP_200_OK)
        else:
            return Response({"error": 'unauth'}, status=status.HTTP_401_UNAUTHORIZED)

       
class DeleteContact(APIView):
    
    def get(self, request, id):

        try:
            contact = Contact.objects.get(id = id)
        except:
            return Response({"error": 'not found'}, status=status.HTTP_404_NOT_FOUND)

        if request.user == contact.user:
            contact.delete()
            return Response({}, status=status.HTTP_200_OK)
        else:
            return Response({"error": 'unauth'}, status=status.HTTP_401_UNAUTHORIZED)


class GetContacts(APIView):

    def get(self, request):

        contacts = list(Contact.objects.filter(user = request.user))

        contactInfos = []
        for contact in contacts:
            contactInfos.append({**contact.info, "id": contact.id})
            
        return Response(contactInfos, status=status.HTTP_200_OK)


class GetContact(APIView):

    def get(self, request, id):

        try:
            contact = Contact.objects.get(id = id)
        except:
            return Response({"error": 'not found'}, status=status.HTTP_404_NOT_FOUND)

        if request.user == contact.user:
            contact = contact.info
            return Response(contact, status=status.HTTP_200_OK)
        else:
            return Response({"error": 'unauth'}, status=status.HTTP_401_UNAUTHORIZED)