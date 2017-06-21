var Mongoose = require('mongoose');
var Schema   = Mongoose.Schema;

var adminSchema = new Schema({
	nickname: String,
	password: String
});

var Admin = Mongoose.model('Admin', adminSchema);

module.exports = Admin;