import smtplib, ssl

from string import Template

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# bot credentials
MY_ADDRESS = 'EMAIL'
PASSWORD = 'PASSWORD'

# get the contacts from the contact file
def get_contacts(filename):
    names = []
    emails = []
    contacts_file = open(filename, "r")
    for a_contact in contacts_file:
        names.append(a_contact.split()[0])
        emails.append(a_contact.split()[1])
    contacts_file.close()
    return names, emails

def read_template(filename):
    template_file = open(filename, "r")
    template_file_content = template_file.read()
    return Template(template_file_content)

names, emails = get_contacts('mycontacts.txt') # read contacts
message_template = read_template('message.txt') # read the message template

port = 465  # For SSL

print("I GOT HERE")

# Create a secure SSL context
context = ssl.create_default_context()

with smtplib.SMTP_SSL("smtp.gmail.com", port, context=context) as server:
    server.login(MY_ADDRESS, PASSWORD)

    print("in the width")

    for email in emails:

        msg = MIMEMultipart()       # create a message

        # add in the actual person name to the message template
        message = message_template

        # Prints out the message body for our sake
        print(message)

        # setup the parameters of the message
        msg['From']=MY_ADDRESS
        msg['To']=email
        msg['Subject']="This is TEST"
        
        # add in the message body
        msg.attach(MIMEText(message, 'plain'))
        
        # send the message via the server set up earlier.
        s.send_message(msg)
        del msg
    
# Terminate the SMTP session and close the connection
s.quit()

print("I ALSO GOT HERE")

# For each contact, send the email