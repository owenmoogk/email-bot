# email-bot
An email bot designed to send emails to masses

My credentials to send the emails are in a file not uploaded to github (as obviously that wouldn't be a great idea.)

You can just set the two variables at the top of main.py (sender and password) to the username and password of the account you are sending from.

To setup the names and emails go into the template.txt file and put in the names and emails that you wish to send to. You will have to redirect to this file (either rename the text file to mycontacts.txt, or change the filename on main.py in line 21).

You can change the message that is being sent in the message.txt file, and use placeholders with {braces}. The top line with 'Subject' is the subject line, so it will not appear in the body of the email.

The /old folder is just older iterations and testing, a lot of which I have pulled from stack overflow.
