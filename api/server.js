'use strict'

const express = require('express');
const MongooseController = require('./mongooseController');
const path = require('path');
const routes = require('./routes');
const winston = require('winston');

const log = new winston.Logger({
    transports : [
        new (winston.transports.File)({
            name : 'info-log',
            filename : 'log.log',
            level : 'info',
            json : false,
            prettyPrint : true
        }),
        new (winston.transports.File)({
            name : 'info-error',
            filename : 'log.log',
            level : 'error',
            json : false,
            prettyPrint : true
        }),
        new (winston.transports.Console)({
            level : 'debug',
            timestamp : true,
            colorize : true,
            json : false,
            prettyPrint : true
        })
    ]
});

const app = express();
const databaseAddress = (process.env.DB_ADDR || 'mongodb://localhost/test');
const mongo = new MongooseController(databaseAddress, log);

app.set('port', (process.env.PORT || process.env.FIFA_CHAMPS_PORT || 5001));
app.listen(app.get('port'));

log.debug('Listening at port: ' + app.get('port'));

routes.set(app, mongo, log);

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

module.exports = app;
