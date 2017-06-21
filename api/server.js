"use strict"

const express = require('express');
const app = express();

app.set('port', (process.env.PORT || process.env.FIFA_CHAMPS_PORT || 5001));

const http = app.listen(app.get('port'));

const databaseAddress = (process.env.DB_ADDR || "mongodb://localhost/test");
const MongooseController = require('./mongooseController');
const mongo = new MongooseController(databaseAddress);

console.log("Listening at port: " + app.get("port"));

const routes = require('./routes');
routes.set(app, mongo);

app.get('/', (req, res) => {
	res.sendfile(__dirname + '/dist/index.html');
});

app.get('/:file', (req, res) => {
	const file = req.params.file;
	res.sendfile(__dirname + '/dist/' + file);
});

app.get('*', (req, res) => {
	res.sendfile(__dirname + '/dist/index.html');
});


module.exports = app;
