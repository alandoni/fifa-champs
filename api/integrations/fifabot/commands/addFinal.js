const addMatch = require('./addMatch');

// this is not supposed to be triggered
const pattern = /^STUB FOR HELP COMMAND$/;

module.exports = {
    pattern,
    handler : addMatch,
    usage : '_edsonbastos adicionar final @player1 @player2 team1score (team1penalties) x (team2penalties) team2score @player3 @player4_',
    description : '*adicionar final*: adiciona uma final a temporada atual do fifa-champs',
    channels : ['fifa-champs', 'fifa-champs-dev'],
};
