var Mongoose = require('mongoose');
var Schema   = Mongoose.Schema;

var matchSchema = new Schema({
	player1: {type: Schema.Types.ObjectId, ref: 'Player'},
	player2: {type: Schema.Types.ObjectId, ref: 'Player'},
	player3: {type: Schema.Types.ObjectId, ref: 'Player'},
	player4: {type: Schema.Types.ObjectId, ref: 'Player'},
	team1score: Number,
	team2score: Number,
	team1penalties: Number,
	team2penalties: Number,
	date: Date,
	championship: {type: Schema.Types.ObjectId, ref: 'Championship'},
	isFinal: Boolean
});

var Match = Mongoose.model('Match', matchSchema);
module.exports = Match;