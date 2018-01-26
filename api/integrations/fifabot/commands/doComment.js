// const mongodb = require('../integrations/mongodb');

function doComment() {
  return new Promise((resolve) => {
    resolve('doComment');
  });
  // mongodb.getRandomSilvioComment((error, comment) => {
  //   if (error) {
  //     callback('Vixxxxxxxi...');
  //     return;
  //   }
  //
  //   callback(comment);
  // });
}

module.exports = {
  pattern: /^(comenta)|(comentar).*$/,
  handler: doComment,
  description: '*edsonbastos comenta*: faz um comentario',
  channels: ['fifa-champs']
};
