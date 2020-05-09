import psycopg2
import os

connection = psycopg2.connect(dbname=os.environ['USER']
                 , user='tssuser'
                 , password= password=os.environ['DB_PASSWORD']
                 , host='127.0.0.1'
                 , port='5432')

cursor = connection.cursor()

# Boilerplate for the database
query_add_user='insert into "user" (name, digest, role) values(\'supervisor\', \'\', \'supervisor\');'
query_user_id='select id from "user" where name=\'supervisor\';'
query_supervisor='insert into supervisor values (%s, null);'

query_range='insert into range (name) values (\'SATLSTO:n ampumarata\');'
query_range_id ='select id from range where name=\'SATLSTO:n ampumarata\';'

query_tracks='\
insert into track (range_id, name, description) values \
(%s, \'%s\', \'%s\'), \
(%s, \'%s\', \'%s\'), \
(%s, \'%s\', \'%s\'), \
(%s, \'%s\', \'%s\'), \
(%s, \'%s\', \'%s\'), \
(%s, \'%s\', \'%s\'), \
(%s, \'%s\', \'%s\');'

query_track_ids = 'select id from track;'

# Data insertion queries
reservation_query = 'insert into range_reservation (range_id, date, available) \
values(%s, \'%s\', %s);'

select_reservation = 'select id from range_reservation where date = \'%s\';'

schedule_insert = 'insert into scheduled_range_supervision \
(range_reservation_id, supervisor_id, open, close) \
values \
(%s, %s, \'%s\', \'%s\');'

select_schedule = 'select id from scheduled_range_supervision where range_reservation_id = %s;'

insert_range_supervision = 'insert into range_supervision \
(scheduled_range_supervision_id, range_supervisor, notice) \
values \
(%s, \'%s\', \'scripted insert\');'

insert_track_supervision = 'insert into track_supervision \
(scheduled_range_supervision_id, track_id, track_supervisor, notice) \
values \
(%s, %s, \'%s\', \'scripted insert\');'

cursor.execute(query_add_user)
cursor.execute(query_user_id)
user_id = cursor.fetchone()[0]
cursor.execute(query_supervisor % user_id)
cursor.execute(query_range)
cursor.execute(query_range_id)
range_id = cursor.fetchone()[0]

cursor.execute(query_tracks % (
    range_id, 'Rata 1', '25m Pistoolirata - 60 ampumapaikkaa(3 x 20 paikkaa väliseinin)'
    , range_id, 'Rata 2', '150m RK -rata - 40 ampumapaikkaa'
    , range_id, 'Rata 3', '300m Kiväärirata - 40 ampumapaikkaa'
    , range_id, 'Rata 4', '75m / 100m Hirvirata - 20 ampumapaikkaa (75m) / 4 paikkainen ampumakoppi (100m)'
    , range_id, 'Rata 5', '100m Kohdistusrata - 4 ampumapaikkaa'
    , range_id, 'Rata 6', '50m pienoiskiväärirata - 60 ampumapaikkaa, nauhataululaitteet'
    , range_id, 'Rata 7', 'Toiminta-ampumarata - 25 ampumapaikkaa'))

cursor.execute(query_track_ids)

connection.commit()

track_ids = [val[0] for val in cursor.fetchall()]

import json
import sys
from datetime import datetime

input_handle = open('calendar.json', 'r')
calendar = json.load(input_handle)

for entry in calendar:
    start = entry['start'].get('dateTime', entry['start'].get('date'))
    end = entry['end'].get('dateTime', entry['end'].get('date'))
    print(start)

    summary = entry['summary'].lower()
    if summary == 'radat auki' or summary == 'rata auki' or summary == 'osa radoista auki':
        pass
        time_format ='%Y-%m-%dT%H:%M:%S%z'
        start_time = datetime.strptime(start, time_format)
        end_time = datetime.strptime(end, time_format)
        start_date = datetime.strftime(start_time, '%Y-%m-%d')
        try:
            cursor.execute(reservation_query % (range_id , start_date, 'true'))
        except:
            connection.rollback()
            continue
        cursor.execute(select_reservation % start_date)
        reservation_id = cursor.fetchone()[0]
        start_moment = datetime.strftime(start_time, '%H:%M:%S')
        end_moment = datetime.strftime(end_time, '%H:%M:%S')
        cursor.execute(schedule_insert % (reservation_id, user_id, start_moment, end_moment))
        cursor.execute(select_schedule % reservation_id)
        schedule_id = cursor.fetchone()[0]
        cursor.execute(insert_range_supervision % (schedule_id, 'present'))
        for track in track_ids:
            cursor.execute(insert_track_supervision % (schedule_id, track, 'present'))
        connection.commit()
    else:
        time_format = '%Y-%m-%d'
        start_date = datetime.strptime(start, time_format)
        try:
            cursor.execute(reservation_query % (range_id, start_date, 'false'))
        except:
            connection.rollback()
            continue
        connection.commit()
