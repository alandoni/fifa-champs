const mongoose = require('mongoose');
const variables = require('../../variables');

mongoose.Promise = global.Promise;
mongoose.connect(variables.MONGO_CONNECTION_STR);

module.exports = { };
