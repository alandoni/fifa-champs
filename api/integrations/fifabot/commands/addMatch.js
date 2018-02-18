const request = require('request-promise');
const { FIFABOT_API_URL } = require('../variables');

// adicionar partida @player1 @player2 team1score x team2score @player3 @player4
const pattern = /^adicionar (partida|final) @?(.*) @?(.*) (\d+)(?: \((\d+)\))? x (?:\((\d+)\) )?(\d+) @?(.*) @?(.*)$/;
const ISFINAL = 1
const PLAYER1 = 2;
const PLAYER2 = 3;
const TEAM1SCORE = 4;
const TEAM1PENALTIES = 5;
const TEAM2PENALTIES = 6;
const TEAM2SCORE = 7;
const PLAYER3 = 8;
const PLAYER4 = 9;

function addMatch(message) {
    return new Promise((resolve, reject) => {
        const captureGroups = message.text.match(pattern);
        const seasonsPromise = getSeasons();
        const playersPromise = getPlayers();
        const adminsPromise = getAdmins(message.token);

        // resolves all requests, build the match object and then post the match on fifa-champs api
        Promise.all([seasonsPromise, playersPromise, adminsPromise])
            .then((resolvedPromises) => buildMatchObject(resolvedPromises, message.userName, captureGroups))
            .then((match) => addMatchToMongo(message.token, match))
            .then(() => resolve('partida adicionada.'))
            .catch((error) => reject(new Error(`partida não adicionada (${error.message})`)));
    });
}

function buildMatchObject([seasonsBody, playersBody, adminsBody], userName, captureGroups) {
    return new Promise((resolve, reject) => {
        const championship = seasonsBody.find((season) => season.isCurrent === true);
        const isUserAdmin = adminsBody.find((admin) => admin.nickname === userName);

        if (!isUserAdmin) {
            reject(new Error(':slack-jihad: acesso negado :slack-jihad:'));
        }

        const isFinal = captureGroups[ISFINAL] == 'final';

        if (!isFinal && (captureGroups[TEAM1PENALTIES] || captureGroups[TEAM2PENALTIES])) {
            reject(new Error('use o comando de adicionar final.'));
        }

        const player1 = playersBody.find((player) => player.nickname === captureGroups[PLAYER1]);
        const player2 = playersBody.find((player) => player.nickname === captureGroups[PLAYER2]);
        const team1score = captureGroups[TEAM1SCORE];
        const team1penalties = captureGroups[TEAM1PENALTIES] || 0;
        const team2penalties = captureGroups[TEAM2PENALTIES] || 0;
        const team2score = captureGroups[TEAM2SCORE];
        const player3 = playersBody.find((player) => player.nickname === captureGroups[PLAYER3]);
        const player4 = playersBody.find((player) => player.nickname === captureGroups[PLAYER4]);
        const date = new Date().toISOString();

        [player1, player2, player3, player4].forEach((player, index) => {
            if (!player) {
                reject(new Error(`jogador invalido: player${index + 1}`));
            }
        })

        resolve({
            championship, player1, player2, player3, player4, team1score, team2score, team1penalties, team2penalties, isFinal, date
        });
    });
}

function getSeasons() {
    return request({
        url : `${FIFABOT_API_URL}/api/championships`,
        method : 'GET',
        json : true
    });
}

function getPlayers() {
    return request({
        url : `${FIFABOT_API_URL}/api/players`,
        method : 'GET',
        json : true
    });
}

function getAdmins(token) {
    return request({
        url : `${FIFABOT_API_URL}/api/admin`,
        method : 'GET',
        headers : {
            'x-access-token' : token
        },
        json : true
    });
}

function addMatchToMongo(token, match) {
    return request({
        url : `${FIFABOT_API_URL}/api/matches`,
        method : 'POST',
        form : match,
        headers : {
            'x-access-token' : token
        },
        json : true
    });
}

module.exports = {
    pattern,
    handler : addMatch,
    usage : '_edsonbastos adicionar partida @player1 @player2 team1score x team2score @player3 @player4_',
    description : '*adicionar partida*: adiciona uma partida a temporada atual do fifa-champs',
    channels : ['fifa-champs', 'fifa-champs-dev'],
};
