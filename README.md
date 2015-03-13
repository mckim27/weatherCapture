# weatherCapture 0.9 beta
- 

# requirement 
- casperjs, spookyjs, python 2.7, running rabbitmq in server.

# setting
- 

# role
- weatherCapture.js is producer.
- rabbitmq_pythonClient/sendmail_receiver.py is consumer.

# executing
- producer and consumer must be located a same server.
- execute consumer : python sendmail_receiver.py 
  execute producer : node weatherCapture.js (by scheduler...ex : crontab...)
