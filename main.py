# skipped your comments for readability
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import credentials

sender, password, reciever = credentials.getCredentials()

msg = MIMEMultipart('alternative')
msg['Subject'] = "Alert"
msg['From'] = me
msg['To'] = you

# def get_contacts(filename):
#     names = []
#     emails = []
#     contacts_file = open(filename, "r")
#     for a_contact in contacts_file:
#         names.append(a_contact.split()[0])
#         emails.append(a_contact.split()[1])
#     contacts_file.close()
#     return names, emails

# def read_template(filename):
#     template_file = open(filename, "r")
#     template_file_content = template_file.read()
#     return Template(template_file_content)

# names, emails = get_contacts('mycontacts.txt') # read contacts
# message_template = read_template('message.txt') # read the message template

html = '<html><body><p>Hi, I have the following alerts for you!</p></body></html>'
part2 = MIMEText(html, 'html')

msg.attach(part2)

s = smtplib.SMTP_SSL('smtp.gmail.com')
s.login(sender, password)
s.sendmail(sender, reciever, msg.as_string())
s.quit()

print("Sent!")