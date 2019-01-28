"use strict"

var express = require('express');
var app = express();

var bodyParser = require('body-parser');

app.use(express.static('public'));

var songs = {"hai": {"fulltitle": "Blah Blah", "type": "atonal"}};

app.get('/songs', function(req, resp){
	var t = req.query.title;
	console.log(t)
	resp.send('Hello world' + songs[t].fulltitle);
})

app.listen(8080);