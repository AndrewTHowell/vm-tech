"use strict"

const express = require('express');
const app = express();

var bodyParser = require('body-parser');

app.use(express.static('public'));

var songs = {"hai": {"fulltitle": "Blah Blah", "type": "atonal"}};

var people = {"doctorwhocomposer": {"username":"doctorwhocomposer", "forename":"Delia", "surname":"Derbyshire"}}

app.get('/people', function(req, resp){
	resp.send(people);
})

app.get('/people/:username', function(req, resp){
	var response = people[req.query.username];
	console.log(people[req.query.username]);
	resp.send(response);
})

app.post('/people', function(req, resp){
	if(!(req.username in people)){
		people[username] = {"username":req.username, "forename":req.forename, "surname":req.surname}
	}
})

module.exports = app;