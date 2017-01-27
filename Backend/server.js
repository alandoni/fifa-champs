"use strict"

const express = require('express');
const app = express();

app.set('port', (process.env.PORT || 5001));

const http = app.listen(app.get('port'));

const databaseAddress = 'mongodb://localhost/test';
const MongooseController = require('./MongooseController');
const mongo = new MongooseController(databaseAddress);

console.log("Listening at port: " + app.get("port"));

const routes = require('./routes');
routes.set(app, mongo);

module.exports = app;