const request = require('request');

const pattern = /^add season$/;

function addSeason() {
  return new Promise((resolve, reject) => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getYear() + 1900;
    const date = today.toISOString();
    const isCurrent = true;
    const matches = [];
    const players = [];
    const form = { month, year, isCurrent, matches, players, date };
    request({
      url: 'http://localhost:5001/api/championships',
      form,
      method: 'POST',
      json: true
    }, (error) => {
      if (error) {
        console.info(error);
        reject('erro ao criar temporada.');
      }

      resolve('temporada criada.');
    });
  });
}

module.exports = {
  pattern,
  handler: addSeason,
  description: '*edsonbastos add season*: adds a new season to fifa-champs',
  channels: ['fifa-champs-dev'],
};
