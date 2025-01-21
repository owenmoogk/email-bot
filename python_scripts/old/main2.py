import smtplib, ssl

sender = "EMAIL"
password = "PASSWORD"

port = 465

recieve = "RECIEVER"

message = """\
MESSAGE
"""

context = ssl.create_default_context()

print("Starting to send")
with smtplib.SMTP_SSL("smtp.gmail.com", port, context=context) as server:

    print("starting to log in")

    server.login(sender, password)

    print("logged in")

    server.sendmail(sender, recieve, message)

print("sent email!")
