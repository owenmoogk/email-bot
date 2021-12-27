import base64
import json

from .models import GmailToken
from users.views import User

from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request as GRequest
from google.oauth2.credentials import Credentials
from email.mime.text import MIMEText

from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from apscheduler.schedulers.background import BackgroundScheduler

from django.shortcuts import redirect

from userdata.models import Contact, Template


SCOPES = ['https://mail.google.com/']

scheduler = None


def startScheduler():
    global scheduler
    scheduler = BackgroundScheduler()
    scheduler.start()


class Callback(APIView):

    permission_classes = [AllowAny]

    def get(self, request):

        userId = request.query_params.get('state')

        # create the client flow
        flow = InstalledAppFlow.from_client_secrets_file(
            'gmail/credentials.json', scopes=SCOPES)
        flow.redirect_uri = "http://localhost:8000/api/oauth2callback"

        code = request.GET.get('code', '')

        # this updates the flow.credentials with the new token
        flow.fetch_token(code=code)

        GmailToken.objects.create(
            tokenData=flow.credentials.to_json(), user=User.objects.get(id=userId))

        # redirect to the compose
        response = redirect('/compose')
        return response


class Authorize(APIView):

    def get(self, request):

        # check if user is already authorized
        creds = None
        try:
            creds = Credentials.from_authorized_user_info(json.loads(
                GmailToken.objects.get(user=request.user).tokenData))
        except:
            pass

        # if not authorized
        if not creds or not creds.valid:

            # if we can refresh then do so
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(GRequest())

            # otherwise allow the user to sign in
            else:
                flow = InstalledAppFlow.from_client_secrets_file(
                    'gmail/credentials.json', scopes=SCOPES)
                flow.redirect_uri = "http://localhost:8000/api/oauth2callback"
                authorization_url, state = flow.authorization_url(
                    access_type='offline',
                    state=request.user.id,
                    prompt='consent',
                    include_granted_scopes='true')

                # redirect to the google api for login and verification, will be passed back to the callback later
                return Response({'url': authorization_url}, status=status.HTTP_200_OK)

        return Response({}, status=status.HTTP_200_OK)


class AccountInfo(APIView):

    def get(self, request):
        creds = None
        try:
            creds = Credentials.from_authorized_user_info(json.loads(
                GmailToken.objects.get(user=request.user).tokenData))
        except Exception as e:
            return Response({'error': 'unauth'}, status=status.HTTP_401_UNAUTHORIZED)
        service = build('gmail', 'v1', credentials=creds)
        emailAddress = service.users().getProfile(
            userId='me').execute()['emailAddress']

        return Response({'address': emailAddress}, status=status.HTTP_200_OK)


class ExecuteGmailRequest(APIView):

    def post(self, request):

        template = Template.objects.get(id=request.data['template'])
        contactList = []
        for contactId in request.data['contacts']:
            contactList.append(Contact.objects.get(id=contactId))

        # account check
        if template.user != request.user:
            return Response({'error': 'unauth'}, status=status.HTTP_401_UNAUTHORIZED)
        for contact in contactList:
            if contact.user != request.user:
                return Response({'error': 'unauth'}, status=status.HTTP_401_UNAUTHORIZED)

        # get the user credentials
        # TODO check valid credentials and send to login
        creds = None
        try:
            creds = Credentials.from_authorized_user_info(json.loads(
                GmailToken.objects.get(user=request.user).tokenData))
        except Exception as e:
            return Response({'status': 'unauth'}, status=status.HTTP_401_UNAUTHORIZED)

        # SEND THE EMAIL
        service = build('gmail', 'v1', credentials=creds)

        def create_message(sender, to, subject, message_text):
            message = MIMEText(message_text)
            message['to'] = to
            message['from'] = sender
            message['subject'] = subject
            raw_message = base64.urlsafe_b64encode(
                message.as_string().encode("utf-8"))
            return {
                'raw': raw_message.decode("utf-8")
            }

        def send_message(service, user_id, message):
            try:
                message = service.users().messages().send(
                    userId=user_id, body=message).execute()
                return message
            except Exception as e:
                print('An error occurred: %s' % e)
                return None
                
        def getMessageContent(contact, template):
            contactVars = contact.info['variables']
            template = template.info['template']

            indexes = []
            for i in range(0, len(template)):
                if template[i] == '{':
                    initial = i
                    while template[i] != '}':
                        i += 1
                    final = i
                    indexes.append((initial, final))

            variables = []
            for index in indexes:
                variables.append(template[index[0]+1:index[1]])

            for variable in variables:
                for var in contactVars:
                    if var['name'] == variable:
                        template = template.replace("{"+variable+"}", var['value'])

            return(template)

        
        for contact in contactList:
            messageContent = getMessageContent(contact, template)
            print(messageContent)
            message = create_message(
                # sender is already determined by the account
                '', 
                # who are we sending it to
                contact.info['email'],
                # subject line
                'messageContent',
                # message body
                messageContent)

            # actually calling the function to send the email, 'me' is special :)
            send_message(service, 'me', message)

        # response ok, this should be just called by javascript
        return Response({'status': "ok"}, status=status.HTTP_200_OK)


def action(text):
    print("testing here", text)


class Schedule(APIView):

    permission_classes = [AllowAny]

    def get(self, request):

        # date = datetime.datetime.now()
        # change = datetime.timedelta(seconds=10)
        # realTime = date + change
        # text = realTime
        # # IMPORTANT
        # # if we leave no run date, it will happen immediately, this is important if user wants no delay
        # scheduler.add_job(lambda: action(text), 'date', run_date=(realTime))

        # return Response({}, status=status.HTTP_200_OK)

        import requests
        creds = None
        try:
            creds = Credentials.from_authorized_user_info(json.loads(
                GmailToken.objects.get(user=request.user).tokenData))
        except Exception as e:
            return Response({'status': 'unauth'}, status=status.HTTP_401_UNAUTHORIZED)
        r = requests.get(
            'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
            params={'access_token': creds})
        return Response({'thing': r.json()}, status=status.HTTP_200_OK)
