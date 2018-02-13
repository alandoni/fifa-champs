const commands = require('./commandList');

module.exports = {
    parse
};

function parse(message) {
    return new Promise((resolve, reject) => {
        // sweeps all available commands, checking for each command pattern
        const command = commands.reduce((actualCommand, commandCandidate) => {
            if (message.text.match(commandCandidate.pattern)) {
                return commandCandidate;
            }
            return actualCommand;
        }, null);

        if (command == null) {
            console.log('comando invalido');
            reject('comando invalido');
        }

        // check if the stream that was sent the message is allowed to run the command
        if (!isCommandAllowed(command, message)) {
            console.log('comando nao permitido');
            reject('comando nao permitido neste canal');
        }

        console.log(command.description);
        
        command.handler(message)
            .then(resolve)
            .catch(reject);
    });
}

function isCommandAllowed(command, message) {
    // a command is allowed if: channel list is empty; channel is allow (DM); belongs to the command channel list
    return !message.channels || message.channel === 'allow' || (command.channels.indexOf(message.channel) >= 0);
}
