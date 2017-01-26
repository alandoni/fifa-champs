var Mongoose = require('Mongoose');
var Schema   = Mongoose.Schema;

var playerSchema = new Schema({
	nickname: String,
	password: String
});

var Player = Mongoose.model('Player', playerSchema);
module.exports = Player;