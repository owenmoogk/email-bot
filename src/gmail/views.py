import datetime
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

        GmailToken.objects.create(tokenData=flow.credentials.to_json(), user = User.objects.get(id = userId))

        # TODO redirect this back to the homepage
        return Response({'status', 'ok'}, status=status.HTTP_200_OK)


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
                    state= request.user.id,
                    prompt = 'consent',
                    include_granted_scopes='true')

                # redirect to the google api for login and verification, will be passed back to the callback later
                return Response({'url':authorization_url}, status=status.HTTP_200_OK)

        return Response({}, status=status.HTTP_200_OK)


class ExecuteGmailRequest(APIView):

    def get(self, request):

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
                print('Message Id: %s' % message['id'])
                return message
            except Exception as e:
                print('An error occurred: %s' % e)
                return None

        message = create_message('', 'owenmoogk@gmail.com', 'uwu test', 'hi this is a test boom')

        # actually calling the function to send the email, 'me' is special :)
        send_message(service, 'me', message)

        # response ok, this should be just called by javascript
        return Response({'status': "ok"}, status=status.HTTP_200_OK)



def action(text):
    print("testing here", text)



class Schedule(APIView):

    permission_classes = [AllowAny]

    def get(self, request):

        date = datetime.datetime.now()
        change = datetime.timedelta(seconds = 10)
        realTime = date + change
        text = realTime
        # IMPORTANT
        # if we leave no run date, it will happen immediately, this is important if user wants no delay
        scheduler.add_job(lambda: action(text), 'date', run_date=(realTime))
        
        return Response({}, status=status.HTTP_200_OK)