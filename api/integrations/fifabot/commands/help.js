function help() {
  return new Promise((resolve) => {
    resolve('help');
  });
}

module.exports = {
  pattern: /^ajuda$/,
  handler: help,
  description: '*edsonbastos ajuda* : mostra a lista de comandos disponiveis',
  channels: ['fifa-champs']
};
