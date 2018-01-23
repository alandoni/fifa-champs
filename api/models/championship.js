var Mongoose = require('mongoose');
var Schema   = Mongoose.Schema;

var championshipSchema = new Schema({
	month: Number,
	year: Number,
	players: [String],
	matches: [String],
	date: Date,
	finalMatch: {type: Schema.Types.ObjectId, ref: 'Match'},
	isCurrent: Boolean
});

var Championship = Mongoose.model('Championship', championshipSchema);
module.exports = Championship;
