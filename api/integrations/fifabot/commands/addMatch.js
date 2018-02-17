const request = require('request-promise');
const { FIFABOT_API_URL } = require('../variables');

// adicionar partida @player1 @player2 team1score x team2score @player3 @player4
const pattern = /^adicionar partida @?(.*) @?(.*) (\d+)\s*x\s*(\d+) @?(.*) @?(.*)$/;
const seasonsRequestOptions = {
    url : `${FIFABOT_API_URL}/api/championships`,
    method : 'GET',
    json : true
};
const playersRequestOptions = {
    url : `${FIFABOT_API_URL}/api/players`,
    method : 'GET',
    json : true
};
const matchesRequestOptions = {
    url : `${FIFABOT_API_URL}/api/matches`,
    method : 'POST',
    json : true
};
const adminsRequestOptions = {
    url : `${FIFABOT_API_URL}/api/admin`,
    method : 'GET',
    json : true
};
const PLAYER1 = 1;
const PLAYER2 = 2;
const TEAM1SCORE = 3;
const TEAM2SCORE = 4;
const PLAYER3 = 5;
const PLAYER4 = 6;

function addMatch(message, isFinal = false) {
    return new Promise((resolve, reject) => {
        const captureGroups = message.text.match(pattern);
        const seasonsPromise = request(seasonsRequestOptions);
        const playersPromise = request(playersRequestOptions);
        const adminsPromise = request(Object.assign(adminsRequestOptions, { headers : { 'x-access-token' : message.token } }));

        // resolves all requests, build the match object and then post the match on fifa-champs api
        Promise.all([seasonsPromise, playersPromise, adminsPromise])
            .then((resolvedPromises) => buildMatchObject(resolvedPromises, message.userName, captureGroups, isFinal))
            .then((match) => request(Object.assign(matchesRequestOptions, { form : match, headers : { 'x-access-token' : message.token } })))
            .then(() => resolve('partida adicionada.'))
            .catch((error) => reject(new Error(`partida não adicionada (${error.message})`)));
    });
}

function buildMatchObject([seasonsBody, playersBody, adminsBody], userName, captureGroups, isFinal) {
    return new Promise((resolve, reject) => {
        const championship = seasonsBody.find((season) => season.isCurrent === true);
        const isUserAdmin = adminsBody.find((admin) => admin.nickname === userName);

        if (!isUserAdmin) {
            reject(new Error(':slack-jihad: acesso negado :slack-jihad:'));
        }

        const player1 = playersBody.find((player) => player.nickname === captureGroups[PLAYER1]);
        const player2 = playersBody.find((player) => player.nickname === captureGroups[PLAYER2]);
        const team1score = captureGroups[TEAM1SCORE];
        const team2score = captureGroups[TEAM2SCORE];
        const player3 = playersBody.find((player) => player.nickname === captureGroups[PLAYER3]);
        const player4 = playersBody.find((player) => player.nickname === captureGroups[PLAYER4]);
        const date = new Date().toISOString();

        if (!player1 || !player2 || player3 || player4) {
            reject(new Error('jogador invalido'));
        }

        resolve({
            championship, player1, player2, player3, player4, team1score, team2score, isFinal, date
        });
    });
}

module.exports = {
    pattern,
    handler : addMatch,
    usage : '_edsonbastos adicionar partida @player1 @player2 team1score x team2score @player3 @player4_',
    description : '*adicionar partida*: adiciona uma partida a temporada atual do fifa-champs',
    channels : ['fifa-champs', 'fifa-champs-dev'],
};
