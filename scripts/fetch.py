from __future__ import print_function
import datetime
import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request


scopes = ['https://www.googleapis.com/auth/calendar.readonly']
calendar = 'info.tasera@gmail.com'

"""Read GMail calendar entries for the current year.
Defaults to reading info.tasera@gmail.com.
Convert useful results into JSON and passes to /dev/stdout.
"""
creds = None
# The file token.pickle stores the user's access and refresh tokens, and is
# created automatically when the authorization flow completes for the first
# time.
if os.path.exists('token.pickle'):
    with open('token.pickle', 'rb') as token:
        creds = pickle.load(token)
# No picke file, user has to authenticate through a browser.  
if not creds or not creds.valid:
    if creds and creds.expired and creds.refresh_token:
        creds.refresh(Request())
    else:
        flow = InstalledAppFlow.from_client_secrets_file(
            'credentials.json', scopes)
        creds = flow.run_local_server(port=0)
    # Save the credentials for the next run
    with open('token.pickle', 'wb') as token:
        pickle.dump(creds, token)

service = build('calendar', 'v3', credentials=creds)

now = datetime.datetime.now()
start_of_year = datetime.datetime(now.year, 1, 1).isoformat() + 'Z' # 'Z' UTC time
end_of_year = datetime.datetime(now.year, 12, 31).isoformat() + 'Z'

results = service.events().list(
    calendarId=calendar
    , timeMin=start_of_year
    , timeMax=end_of_year
    , maxResults=1000
    , singleEvents=True
    , orderBy='startTime').execute()

events = results.get('items', [])

import json
import sys

json.dump(events, sys.stdout, ensure_ascii=True, indent=4)
