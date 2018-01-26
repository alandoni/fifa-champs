function addComment(message) {
  return new Promise((resolve) => {
    resolve(`addComment ${message}`);
  });
}

module.exports = {
  pattern: /^add comment (.*)$/,
  handler: addComment,
  description: '*edsonbastos add comment*: adds a new comment',
  channels: ['fifa-champs-dev'],
};
