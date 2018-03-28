let Mongoose = require('mongoose');
let Schema   = Mongoose.Schema;

let playerSchema = new Schema({
    nickname : String,
    picture : String
});

let Player = Mongoose.model('Player', playerSchema);
module.exports = Player;
