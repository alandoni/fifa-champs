let Mongoose = require('mongoose');
let Schema   = Mongoose.Schema;

let championshipSchema = new Schema({
    month : Number,
    year : Number,
    players : [{ type : Schema.Types.ObjectId, ref : 'Player' }],
    matches : [{ type : Schema.Types.ObjectId, ref : 'Match' }],
    date : Date,
    finalMatch : { type : Schema.Types.ObjectId, ref : 'Match' },
    isCurrent : Boolean
});

let Championship = Mongoose.model('Championship', championshipSchema);

module.exports = Championship;
