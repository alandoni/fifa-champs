var Mongoose = require('mongoose');
var Schema   = Mongoose.Schema;

var championshipSchema = new Schema({
	month: Number,
	year: Number,
	players: [{type: Schema.Types.ObjectId, ref: 'Player'}],
	matches: [{type: Schema.Types.ObjectId, ref: 'Match'}],
	date: Date,
	finalMatch: {type: Schema.Types.ObjectId, ref: 'Match'},
	isCurrent: Boolean
});

var Championship = Mongoose.model('Championship', championshipSchema);

module.exports = Championship;
