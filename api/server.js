"use strict"

const express = require('express');
const MongooseController = require('./mongooseController');
const path = require('path');
const routes = require('./routes');

const app = express();
const databaseAddress = (process.env.DB_ADDR || "mongodb://localhost/test");
const mongo = new MongooseController(databaseAddress);

app.set('port', (process.env.PORT || process.env.FIFA_CHAMPS_PORT || 5001));
const http = app.listen(app.get('port'));

console.log("Listening at port: " + app.get("port"));

routes.set(app, mongo);

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


module.exports = app;
