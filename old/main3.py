import smtplib
import os.path

from email.mime.text import MIMEText

if (os.path.isfile("filename")):
    print "file exists, all went well"
else:
    print "file not exists, emailing"

    msg = MIMEText("WARNING, FILE DOES NOT EXISTS, THAT MEANS UPDATES MAY DID NOT HAVE BEEN RUN")

    msg['Subject'] = "WARNING WARNING ON FIRE FIRE FIRE!"

    #put your host and port here 
    s = smtplib.SMTP_SSL('host:port')
    s.login('EMAIL','PASSWORD')
    s.sendmail('o','to', msg.as_string())
    s.quit()
print "done"