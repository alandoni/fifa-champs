const request = require('request');

const pattern = /^add player (.*)$/;

function addPlayer(message) {
  return new Promise((resolve, reject) => {
    const nickname = message.text.match(/^add player (.*)$/).slice(1);
    const form = { nickname };
    request({
      url: 'http://localhost:5001/api/players',
      form,
      method: 'POST',
      json: true
    }, (error) => {
      if (error) {
        console.info(error);
        reject(`jogador ${nickname} nao adicionado`);
      }

      resolve(`jogador *${nickname}* adicionado no fifa-champs`);
    });
  });
}

module.exports = {
  pattern,
  handler: addPlayer,
  description: '*edsonbastos add player*: adds a new player to fifa-champs',
  channels: ['fifa-champs-dev'],
};
