// const request = require('request');

const pattern = /^add match (.*) (.*) (\d+)\s*x\s*(\d+) (.*) (.*)$/;

function addMatch(message) {
  // return new Promise((resolve, reject) => {
  return new Promise((resolve) => {
    console.log(message.text.match(pattern));
    const 
    resolve('foi');
    // const today = new Date();
    // const month = today.getMonth() + 1;
    // const year = today.getYear() + 1900;
    // const date = today.toISOString();
    // const isCurrent = true;
    // const matches = [];
    // const players = [];
    // const form = { month, year, isCurrent, matches, players, date };
    // request({
    //   url: 'http://localhost:5001/api/championships',
    //   form,
    //   method: 'POST',
    //   json: true
    // }, (error) => {
    //   if (error) {
    //     console.info(error);
    //     reject('erro ao criar temporada.');
    //   }
    //
    //   resolve('temporada criada.');
    // });
  });
}

module.exports = {
  pattern,
  handler: addMatch,
  description: '*edsonbastos add match*: adds a new match to current fifa-champs season',
  channels: ['fifa-champs-dev'],
};
