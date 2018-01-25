const isValidCommand = require('./utils/isValidCommand');
const commands = require('./index');

function parseCommand(message, callback) {
  const parsed = commands.some((command) => {
    let match;

    if (command.acceptsPreFormattedText && message.preFormattedText) {
      match = message.preFormattedText.match(command.pattern);
    }

    if (!match) {
      match = message.userText.match(command.pattern);
    }

    if (match) {
      if (isValidCommand(command, message)) {
        const params = [message, callback];
        params.push(...match.slice(1));

        command.handler(...params);
      } else {
        callback('C fude kkkkk');
      }

      return true;
    }

    return false;
  });

  if (!parsed) {
    callback(false);
  }
}

module.exports = parseCommand;
