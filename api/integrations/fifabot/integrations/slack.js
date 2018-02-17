const Botkit = require('botkit');
const request = require('request-promise');
const { FIFABOT_TOKEN, FIFABOT_API_URL, FIFABOT_USER, FIFABOT_PASSWORD } = require('../variables');

let token = null;
const controller = Botkit.slackbot({ debug : false });
const bot = controller.spawn({ token : FIFABOT_TOKEN, retry : Infinity });
const api = bot.api;

function getToken() {
    return new Promise((resolve, reject) => {
        if (token) {
            resolve(token);
        }

        request({
            url : `${FIFABOT_API_URL}/api/login`,
            form : {
                nickname : FIFABOT_USER,
                password : FIFABOT_PASSWORD
            },
            method : 'POST',
            json : true
        }).then((loginBody) => {
            token = loginBody.token;
            resolve(token);
        }).catch(() => reject(new Error('invalid fifachamps user credentials')));
    });
}

module.exports = {
    controller,
    bot,
    api,
    getToken
}

