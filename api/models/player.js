var Mongoose = require('mongoose');
var Schema   = Mongoose.Schema;

var playerSchema = new Schema({
	nickname: String,
	picture: String
});

var Player = Mongoose.model('Player', playerSchema);
module.exports = Player;