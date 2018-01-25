const mongoose = require('mongoose');
const SilvioComment = require('./SilvioComment');
const variables = require('../../variables');

mongoose.Promise = global.Promise;
mongoose.connect(variables.MONGO_CONNECTION_STR);

module.exports = {
  getRandomSilvioComment: SilvioComment.getRandomSilvioComment,
  addSilvioComment: SilvioComment.addSilvioComment,
};
