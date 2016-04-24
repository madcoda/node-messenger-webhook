"use strict";

require('dotenv').config();
var express = require('express');
var fs = require('fs');
var https = require('https');
var bodyParser = require('body-parser');
var request = require('request');

/*
	Config
 */

var config = {
	port: process.env.PORT || 1337,
	verify_token: process.env.VERIFY_TOKEN || '',
	page_access_token: process.env.PAGE_ACCESS_TOKEN || '',
	options: {
	    key: fs.readFileSync(process.env.SSL_KEY || 'ssl/privkey.pem'),
	    cert: fs.readFileSync(process.env.SSL_CERT || 'ssl/cert.pem')
	}
};


/*
	Lib functions
 */

function sendTextMessage(sender, text) {
  var messageData = {
    text: text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:config.page_access_token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}


function sendGenericMessage(sender) {
  var messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": "First card",
          "subtitle": "Element #1 of an hscroll",
          "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
          "buttons": [{
            "type": "web_url",
            "url": "https://www.messenger.com/",
            "title": "Web url"
          }, {
            "type": "postback",
            "title": "Postback",
            "payload": "Payload for first element in a generic bubble",
          }],
        },{
          "title": "Second card",
          "subtitle": "Element #2 of an hscroll",
          "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
          "buttons": [{
            "type": "postback",
            "title": "Postback",
            "payload": "Payload for second element in a generic bubble",
          }],
        }]
      }
    }
  };
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:config.page_access_token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}


/*
 * Webhook endpoints
 */

var app = express();
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.status(200).send('messenger-webhook server is up and running.');
});

app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === config.verify_token) {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});



app.post('/webhook/', function (req, res) {
	var messaging_events = req.body.entry[0].messaging;
	for (var i = 0; i < messaging_events.length; i++) {
		var event = req.body.entry[0].messaging[i];
		var sender = event.sender.id;
		// handle message
		if (event.message && event.message.text) {
			var text = event.message.text;
			// Handle a text message from this sender
			if (text === 'Generic') {
				sendGenericMessage(sender);
				continue;
			}else{
				sendTextMessage(sender, text);
				continue;
			}
		}

		// handle postback
		if (event.postback) {
			var text = JSON.stringify(event.postback);
			sendTextMessage(sender, "Postback received: "+text.substring(0, 200), config.page_access_token);
			continue;
		}
	}
	res.sendStatus(200);
});

// create server
https.createServer(config.options, app).listen(config.port);
