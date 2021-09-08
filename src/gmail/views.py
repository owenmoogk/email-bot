from requests.adapters import HTTPResponse
from .models import GmailToken
from django.utils import timezone
from datetime import timedelta
from requests import post, put, get

from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import redirect

import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request as GRequest
from google.oauth2.credentials import Credentials
from email.mime.text import MIMEText
import base64

from rest_framework.views import APIView
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response

SCOPES = ['https://mail.google.com/']

class Callback(APIView):
    def get(self, request, format=None):

        user = request.user.username
        tokenPath = 'gmail/tokens/'+user+'.json'

        state = request.session['state']
        flow = InstalledAppFlow.from_client_secrets_file(
            'gmail/credentials.json',
            scopes=SCOPES,
            state=state)
        flow.redirect_uri = "http://localhost:8000/api/oauth2callback"

        code = request.GET.get('code', '')
        state = request.GET.get('state', '')
        scope = request.GET.get('scope', '')

        flow.fetch_token(code=code, state=state, scope=scope)

        with open(tokenPath, 'w') as token:
            token.write(flow.credentials.to_json())

        return Response({'status', 'poggers'}, status=status.HTTP_200_OK)



class Authorize(APIView):
    def get(self, request, format=None):
        flow = InstalledAppFlow.from_client_secrets_file(
            'gmail/credentials.json', scopes=SCOPES)
        flow.redirect_uri = "http://localhost:8000/api/oauth2callback"
        authorization_url, state = flow.authorization_url(
            access_type='offline',
            include_granted_scopes='true')
        request.session['state'] = state
        return HttpResponseRedirect(authorization_url)

class ExecuteGmailRequest(APIView):

    def get(self, request, format=None):

        user = request.user.username
        creds = None

        tokenPath = 'gmail/tokens/'+user+'.json'
        # get the token or make the token
        if os.path.exists(tokenPath):
            creds = Credentials.from_authorized_user_file(tokenPath, SCOPES)

        # If there are no (valid) credentials available, let the user log in.
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(GRequest())
            else:

                # this prompts the user to login
                flow = InstalledAppFlow.from_client_secrets_file(
                    'gmail/credentials.json', SCOPES)
                flow.redirect_uri = 'http://127.0.0.1:8000/api/send/'
                auth_url, state = flow.authorization_url(
                    access_type='offline', include_granted_scopes='true')
                creds = redirect(auth_url)

            print('creds', creds)

            # Save the credentials for the next run
            with open(tokenPath, 'w') as token:
                token.write(creds.to_json())

        # send the email
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

        message = create_message(
            'owenmoogk@gmail.com', 'moogo4920@wrdsb.ca', 'uwu test', 'hi this is a test thing')

        send_message(service, 'me', message)

        return Response({'status': "sent"}, status=status.HTTP_200_OK)
