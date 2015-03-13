try {
    var Spooky = require('spooky');
} catch (e) {
    var Spooky = require('../lib/spooky');
}
var amqp = require('amqplib');
var when = require('when');
var spooky = new Spooky({
        child: {
            transport: 'http'
        },
        casper: {
            logLevel: 'debug',
            verbose: true,
            viewportSize:{
              width: 1024,
              height: 768
            }
        }
    }, function (err) {
        if (err) {
            e = new Error('Failed to initialize SpookyJS');
            e.details = err;
            throw e;
        }
        spooky.start('http://search.daum.net/search?w=tot&q=%EC%84%9C%EC%9A%B8%20%EA%B4%91%EC%A7%84%EA%B5%AC%20%EC%9E%90%EC%96%911%EB%8F%99%20%EB%82%A0%EC%94%A8');

        spooky.then(function () {
          this.captureSelector('daum_weather.png', '#weatherColl');
        });
        
        spooky.then(function () {
            var data = {'queue' : 'email', 'addr':'youremail'};
            this.emit('amqp', data);
        });

        spooky.run();
    });

spooky.on('error', function (e, stack) {
    console.error(e);

    if (stack) {
        console.log(stack);
    }
});

/*
// Uncomment this block to see all of the things Casper has to say.
// There are a lot.
// He has opinions.
spooky.on('console', function (line) {
    console.log(line);
});
*/

spooky.on('amqp', function (data) {
    //console.log(data);
    amqp.connect('amqp://192.168.0.6').then(function(conn) {
    return when(conn.createChannel().then(function(ch) {
      console.log(data);
      var q = data['queue'];
      var msg = data['addr'];

      var ok = ch.assertQueue(q, {durable: false});

      return ok.then(function(_qok) {
        ch.sendToQueue(q, new Buffer(msg));
        console.log(" [x] Sent '%s'", msg);
        return ch.close();
      });
    })).ensure(function() { conn.close(); });;
  }).then(null, console.warn);
});

spooky.on('log', function (log) {
    if (log.space === 'remote') {
        console.log(log.message.replace(/ \- .*/, ''));
    }
});
