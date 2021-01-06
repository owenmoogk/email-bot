import smtplib
import credentials

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
    return (template_file_content)

def sendEmail(name, email):
    message = message_template.format(PERSON_NAME = name)
    s = smtplib.SMTP_SSL('smtp.gmail.com')
    s.login(sender, password)
    s.sendmail(sender, email, message)
    s.quit()

sender, password = credentials.getCredentials() # get my email credentials
message_template = read_template('message.txt') # read the message template
names, emails = get_contacts('mycontacts.txt') # read contacts

# loop thru all
for i in range(0,len(names)):
    name = names[i]
    email = emails[i]
    sendEmail(name, email)
    print("Sent")

print("Finished")