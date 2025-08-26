from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Template

class AddTemplate(APIView):

    def post(self, request):

        data = request.data

        if not (data['title'] and data['template']):
            return Response({}, status=status.HTTP_400_BAD_REQUEST)

        Template.objects.create(info=data, user=request.user)

        return Response({}, status=status.HTTP_200_OK)


class EditTemplate(APIView):

    def post(self, request, id):

        data = request.data

        if not (data['title'] and data['template']):
            return Response({}, status=status.HTTP_400_BAD_REQUEST)

        template = Template.objects.get(id = id)

        if template.user == request.user:
            template.info = data
            template.save()
            return Response({}, status=status.HTTP_200_OK)
        else:
            return Response({"error": 'unauth'}, status=status.HTTP_401_UNAUTHORIZED)


class DeleteTemplate(APIView):
    
    def get(self, request, id):

        try:
            template = Template.objects.get(id = id)
        except:
            return Response({"error": 'not found'}, status=status.HTTP_404_NOT_FOUND)

        if request.user == template.user:
            template.delete()
            return Response({}, status=status.HTTP_200_OK)
        else:
            return Response({"error": 'unauth'}, status=status.HTTP_401_UNAUTHORIZED)


class GetTemplates(APIView):

    def get(self, request):

        templates = list(Template.objects.filter(user = request.user))

        templateData = []
        for template in templates:
            templateData.append({**template.info, 'id': template.id}) 
        return Response(templateData, status=status.HTTP_200_OK)


class GetTemplate(APIView):

    def get(self, request, id):

        try:
            template = Template.objects.get(id = id)
        except:
            return Response({"error": 'not found'}, status=status.HTTP_404_NOT_FOUND)

        if request.user == template.user:
            return Response(template, status=status.HTTP_200_OK)
        else:
            return Response({"error": 'unauth'}, status=status.HTTP_401_UNAUTHORIZED)