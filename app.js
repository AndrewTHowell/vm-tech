"use strict"

const express = require('express');
const rateLimit = require("express-rate-limit");
const app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true}));

app.use(express.static('public'));

//app.enable("trust proxy");

const limiter = rateLimit({
	windowMs: 15 * 60 * 100, // 15 minutes
	max: 20
});

app.use(limiter);

var people = {"andrewHowell": {"username":"andrewHowell", "forename":"Andrew", "surname":"Howell", "role":"Head of External Events", "password":"password"}
	,"shannonMoxey": {"username":"shannonMoxey", "forename":"Shannon", "surname":"Moxey", "role":"Head of Tech", "password":"password"}
	,"SamHumphriss": {"username":"SamHumphriss", "forename":"Sam", "surname":"Humphriss", "role":"Deputy Head of Tech / Head of Light", "password":"password"}
	,"jamesOrr": {"username":"jamesOrr", "forename":"James", "surname":"Orr", "role":"Head of Sound", "password":"password"}
	,"mollyGould": {"username":"mollyGould", "forename":"Molly", "surname":"Gould", "role":"Head of Equipment", "password":"password"}
};

var serviceRequests = {
	0: [0,
		'Andrew',
		'Howell',
		'howelldrew99@gmail.com',
		'Mildert Event',
		'BOP',
		'2019-02-09',
		'21:00',
		'02:00',
		[ 'Base Lights', 'Profile Lights', 'RGB Lights' ],
		'Yes',
		'3',
		'2',
		'0',
		false ]
};
var requestIDCounter = 1;

var messages = {
	0:[ 0,
		 'Mike Tyson',
		 'mikeyBoi@hotmail.com',
		 '0123456789',
		 'Yo, wassup bro. Imma be in Durham tomorrow, hit me up for some sick times',
		 false ]
};
var messageIDCounter = 1;

app.get('/people', function(req, resp){
	resp.send(people);
})

app.get('/people/:username', function(req, resp){
	var response = people[req.params.username];
	resp.send(response);
})

app.get('/serviceRequest', function(req, resp){
	resp.send(serviceRequests);
})

app.get('/completeRequest', function(req, resp){
	var request = serviceRequests[req.query.id]
	var requestLength = request.length;
	var response = request[requestLength - 1];
	resp.send(response);
})

app.get('/message', function(req, resp){
	resp.send(messages);
})

app.get('/answeredMessage', function(req, resp){
	var message = messages[req.query.id]
	var messageLength = message.length;
	var response = message[messageLength - 1];
	resp.send(response);
})

app.post('/people', function(req, resp, next){
	//console.log("People post request");
	if(req.body.access_token == 'concertina'){
		if(!(req.body.username in people)){
			people[req.body.username] = {"username":req.body.username, "forename":req.body.firstname, "surname":req.body.surname, "role":req.body.role, "password":req.body.password}
			resp.send(true);
			//console.log(people);
		}
		else{
			// Username taken
			resp.status(400).send("Username taken");
		}
	}
	else{
		//console.log('Forbidden');
		resp.status(403);
		resp.send('Forbidden');
	}
})

app.post('/logIn', function(req, resp){
	//console.log("Login request");
	if(req.body.access_token == 'concertina'){
		var username = req.body.username;
		var password = req.body.password;
		
		//console.log("1");
		
		if(people[username]["password"] == password){
			var user = people[username]
			resp.send(user["forename"] + " " + user["surname"])
			//console.log(username + "logged in");
		}
		else{
			//console.log("Wrong password");
			resp.send(false);
		}
	}
	else{
		//console.log('Forbidden');
		resp.status(403);
		resp.type('txt').send('Forbidden');
	}
})

app.post('/serviceRequest', function(req, resp){
	//console.log("Service Request");
	if(req.body.access_token == 'concertina'){

		var firstName = req.body.firstName;
		var lastName = req.body.lastName;
		var email = req.body.email;
		var eventType = req.body.eventType;
		var eventDesc = req.body.eventDesc;
		var eventDate = req.body.eventDate;
		var startTime = req.body.startTime;
		var endTime = req.body.endTime;
		
		var lightSelect = req.body.lightSelect;
		var lightDesk = req.body.lightDesk;
		
		var voiceMics = req.body.voiceMics;
		var instrumentMics = req.body.instrumentMics;
		var wirelessMics = req.body.wirelessMics;
		
		var requestID = requestIDCounter;
		requestIDCounter = requestIDCounter ++;
		serviceRequests[requestID] = [requestID,firstName, lastName, email, eventType, eventDesc, eventDate, startTime, endTime, lightSelect, lightDesk, voiceMics, instrumentMics, wirelessMics, false];
		
		console.log(serviceRequests);
		resp.send(true);
	}
	else{
		//console.log('Forbidden');
		resp.status(403);
		resp.type('txt').send('Forbidden');
	}
})

app.post('/message', function(req, resp){
	//console.log("Login request");
	if(req.body.access_token == 'concertina'){
		
		var name = req.body.name;
		var email = req.body.email;
		var phone = req.body.phone;
		var message = req.body.message;
		
		var messageID = messageIDCounter;
		messageIDCounter = messageIDCounter ++;
		messages[messageID] = [messageID, name, email, phone, message, false];
		console.log(messages);
		resp.send(true);
	}
	else{
		//console.log('Forbidden');
		resp.status(403);
		resp.type('txt').send('Forbidden');
	}
})

app.post('/completeRequest', function(req, resp){
	//console.log("Login request");
	if(req.body.access_token == 'concertina'){
		serviceRequests[req.body.id].pop(); // Mark as completed
		serviceRequests[req.body.id].push(true);
		console.log(serviceRequests);
		resp.send(true);
	}
	else{
		//console.log('Forbidden');
		resp.status(403);
		resp.type('txt').send('Forbidden');
	}
})

app.post('/answeredMessage', function(req, resp){
	if(req.body.access_token == 'concertina'){
		messages[req.body.id].pop(); // Mark as completed
		messages[req.body.id].push(true);
		console.log(messages);
		resp.send(true);
	}
	else{
		//console.log('Forbidden');
		resp.status(403);
		resp.type('txt').send('Forbidden');
	}
})

app.use(function(req, res, next){
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});

module.exports = app;