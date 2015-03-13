# -*- coding:utf-8 -*-

import pika
import smtplib
from function import send_weatherMail

mqhost = 'your_mqhost'

connection = pika.BlockingConnection(pika.ConnectionParameters(mqhost))
channel = connection.channel()

channel.queue_declare(queue='email')

print ' [*] Waiting for messages. To exit press CTRL+C'

def callback(ch, method, properties, body):
    print " [x] Received %r" % (body,)
    send_weatherMail(body, "오늘의 날씨", "오늘의 날씨",
                     body, 'yourpassword')

channel.basic_consume(callback, queue='email', no_ack=True)
channel.start_consuming()
