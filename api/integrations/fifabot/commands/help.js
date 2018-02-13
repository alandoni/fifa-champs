const pattern = /^ajuda(\s+uso)?$/;

const USAGE = 1;

function help(message) {
    return new Promise((resolve) => {
        const commands = require('./commandList');
        const withUsage = message.text.match(pattern)[USAGE];
        const helpMessage = commands.reduce((currentText, command) => {
            currentText.push(command.description);
            if (withUsage) {
                currentText.push(`\t${command.usage}`)
            }
            return currentText;
        }, []);
        resolve(helpMessage.join('\n'));
    });
}

module.exports = {
    pattern,
    handler : help,
    usage : '_edsonbastos ajuda (uso)_',
    description : '*ajuda*: mostra a lista de comandos disponiveis',
    channels : ['fifa-champs', 'fifa-champs-dev']
};
