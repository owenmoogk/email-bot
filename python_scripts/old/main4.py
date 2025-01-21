import smtplib  

fromaddr = 'EMAIL'  
toaddrs  = 'RECIEVER'  
msg = "I was bored!"


# Credentials   

password = 'PASS'

# The actual mail send  
server = smtplib.SMTP('smtp.gmail.com:465')  
server.starttls()  
server.login(fromaddr,password)




server.sendmail(fromaddr, toaddrs, msg)


server.quit()

print ("done") 
