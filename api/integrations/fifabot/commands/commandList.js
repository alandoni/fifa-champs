const addComment = require('./addComment');
const doComment = require('./doComment');
const addPlayer = require('./addPlayer');
const addSeason = require('./addSeason');
const addMatch = require('./addMatch');
const help = require('./help');

// add your commands here
module.exports = [
  addComment,
  doComment,
  addPlayer,
  addSeason,
  addMatch,
  help
];
