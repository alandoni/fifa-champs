const commands = require('./commandList');

module.exports = {
  parse
};

function parse(message) {
  return new Promise((resolve, reject) => {
    const command = commands.reduce((actualCommand, commandCandidate) => {
      console.log(`text: ${message.text} actualCommand: ${actualCommand} commandCandidate: ${commandCandidate.pattern}`);
      if (message.text.match(commandCandidate.pattern)) {
        return commandCandidate;
      }
      return actualCommand;
    }, null);

    if (command == null) {
      reject('invalid command');
    }

    if (!isCommandAllowed(command, message)) {
      reject('command not allowed in this channel');
    }

    command.handler(message)
      .then(resolve)
      .catch(reject);
  });
}

function isCommandAllowed(command, message) {
  return !message.channels || message.channel === 'allow' || (command.channels.indexOf(message.channel) >= 0);
}
