const request = require('request-promise');

const pattern = /^add match (.*) (.*) (\d+)\s*x\s*(\d+) (.*) (.*)$/;
const seasonOptions = {
  url: 'http://localhost:5001/api/championships',
  method: 'GET',
  json: true
};
const playerOptions = {
  url: 'http://localhost:5001/api/players',
  method: 'GET',
  json: true
};
const matchOptions = {
  url: 'http://localhost:5001/api/matches',
  method: 'POST',
  json: true
};
const PLAYER1 = 1;
const PLAYER2 = 2;
const TEAM1SCORE = 3;
const TEAM2SCORE = 4;
const PLAYER3 = 5;
const PLAYER4 = 6;

function addMatch(message, isFinal = false) {
  return new Promise((resolve, reject) => {
    const args = message.text.match(pattern);
    const seasonsPromise = request(seasonOptions);
    const playersPromise = request(playerOptions);

    Promise.all([seasonsPromise, playersPromise])
      .then(([seasonsBody, playersBody]) => {
        const championship = seasonsBody.find(season => season.isCurrent === true);
        const player1 = playersBody.find(player => player.nickname === args[PLAYER1]);
        const player2 = playersBody.find(player => player.nickname === args[PLAYER2]);
        const team1score = args[TEAM1SCORE];
        const team2score = args[TEAM2SCORE];
        const player3 = playersBody.find(player => player.nickname === args[PLAYER3]);
        const player4 = playersBody.find(player => player.nickname === args[PLAYER4]);
        const date = new Date().toISOString();
        return {
          championship, player1, player2, player3, player4, team1score, team2score, isFinal, date
        };
      })
      .then(match => request(Object.assign(matchOptions, { form: match })))
      .then(() => resolve('partida adicionada.'))
      .catch(error => reject(`partida não adicionada (${error})`));
  });
}

module.exports = {
  pattern,
  handler: addMatch,
  description: '*edsonbastos add match*: adds a new match to current fifa-champs season',
  channels: ['fifa-champs-dev'],
};
