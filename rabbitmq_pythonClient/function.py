# -*- coding:utf-8 -*-
import os, smtplib
from email.MIMEMultipart import MIMEMultipart
from email.MIMEBase import MIMEBase
from email.MIMEText import MIMEText
from email.header import Header
from email import Encoders
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart
import time
import datetime
import random

# send mail to naver function

def send_weatherMail(to, subject, text, user, pwd):
    username="weather_bot@understanding.so"
    msg=MIMEMultipart('오늘의 날씨')
    msg['From']= username
    msg['To']=to
    msg['Subject']=Header(subject,'utf-8') # 제목 인코딩
    
    # image file set
    filePath = 'your weather image full path'
    fp = open(filePath, 'rb')
    img = MIMEImage(fp.read())
    fp.close()
    img.add_header('Content-Disposition', 'attachment; filename="%s"' % os.path.basename(filePath))
    msg.attach(img)

    msg.attach(MIMEText(text, 'plain', 'utf-8')) # 내용 인코딩
    mailServer=smtplib.SMTP_SSL("smtp.naver.com", 465)
    mailServer.login(user,pwd)
    mailServer.sendmail(user, to, msg.as_string())
    mailServer.close()
