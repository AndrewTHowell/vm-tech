"use strict"

var express = require('express');
var app = express();

var bodyParser = require('body-parser');

app.use(express.static('public'));

var songs = {"hai": {"fulltitle": "Blah Blah", "type": "atonal"}};

app.get('/songs', function(req, resp){

	const title = req.query.title;
  resp.send('Hello world ' + songs[title].fulltitle);
})

app.listen(8090);

//hello
