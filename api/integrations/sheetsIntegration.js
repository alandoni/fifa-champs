'use strict'

let fs = require('fs');
let readline = require('readline');
let google = require('googleapis');
let googleAuth = require('google-auth-library');
let SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
let TOKEN_DIR = 'resources/';
let TOKEN_PATH = TOKEN_DIR + 'credentials_sheets.json';
let SECRET_PATH = TOKEN_DIR + 'client_secret_sheets.json';

let SHEETS_ID = '1QfszMcuwleISfdd63pmUWavtnH6LCXhY_tWhnHerJ4g';
let sheetMonths = process.argv.slice(2);

const databaseAddress = (process.env.DB_ADDR || 'mongodb://localhost/test');
const MongooseController = require('../mongooseController');
const mongo = new MongooseController(databaseAddress);
const ChampionshipController = require('../controllers/championshipController');
const PlayerController = require('../controllers/playerController');
const MatchController = require('../controllers/matchController');

let championshipModel = require('../models/championship')
let matchModel = require('../models/match')

const championshipController = new ChampionshipController(mongo);
const playerController = new PlayerController(mongo);
const matchController = new MatchController(mongo);

// Load client secrets from a local file.
fs.readFile(SECRET_PATH, function processClientSecrets(err, content) {
    if (err) {
        console.log('Error loading client secret file: ' + err);
        return;
    }
    // Authorize a client with the loaded credentials, then call the
    // Google Sheets API.
    authorize(JSON.parse(content), getMatchesFromSpreadsheet);
});

/**
* Create an OAuth2 client with the given credentials, and then execute the
* given callback function.
*
* @param {Object} credentials The authorization client credentials.
* @param {function} callback The callback to call with the authorized client.
*/
function authorize(credentials, callback) {
    let clientSecret = credentials.installed.client_secret;
    let clientId = credentials.installed.client_id;
    let redirectUrl = credentials.installed.redirect_uris[0];
    let auth = new googleAuth();
    let oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, function (err, token) {
        if (err) {
            getNewToken(oauth2Client, callback);
        } else {
            oauth2Client.credentials = JSON.parse(token);
            callback(oauth2Client, sheetMonths);
        }
    });
}

/**
* Get and store new token after prompting for user authorization, and then
* execute the given callback with the authorized OAuth2 client.
*
* @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
* @param {getEventsCallback} callback The callback to call with the authorized
*     client.
*/
function getNewToken(oauth2Client, callback) {
    let authUrl = oauth2Client.generateAuthUrl({
        access_type : 'offline',
        scope : SCOPES
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
    let rl = readline.createInterface({
        input : process.stdin,
        output : process.stdout
    });
    rl.question('Enter the code from that page here: ', function (code) {
        rl.close();
        oauth2Client.getToken(code, function (err, token) {
            if (err) {
                console.log('Error while trying to retrieve access token', err);
                return;
            }
            oauth2Client.credentials = token;
            storeToken(token);
            callback(oauth2Client, sheetMonths);
        });
    });
}

/**
* Store token to disk be used in later program executions.
*
* @param {Object} token The token to store to disk.
*/
function storeToken(token) {
    try {
        fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
        if (err.code != 'EEXIST') {
            throw err;
        }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token));
    console.log('Token stored to ' + TOKEN_PATH);
}

function fetchDatesFromResult(values, arrayMatches, index, yearToSave, monthToSave) {
    // Getting the dates from all Matches and populating arrayMatches
    let dayToSave = null;
    let currentDateBeingSet = null;

    /* Sheets api doesn't return empty values from the end of a row/collumn, so the comparison here
    has to be made by the number of player's collumns and not the one from date */
    for (let dateIndex = 0; dateIndex < values[index + 1].length; dateIndex += 2) {
        // Date wil be null/undefined if it's the same as previous one
        if ((values[index][dateIndex] != '') && (values[index][dateIndex] !== null)) {
            dayToSave = values[index][dateIndex].slice(0, 2);
            currentDateBeingSet = new Date('20' + yearToSave, monthToSave - 1, dayToSave);
        }

        arrayMatches.push(new matchModel({ date : currentDateBeingSet, isFinal : false }));

    }
}

function fetchScoreFromResult(values, arrayMatches, index, lastMatchArray) {
    let currentMatch = lastMatchArray;
    if (values[index + 2].length == values[index + 3].length) {
        for (let scoreIndex = 0; scoreIndex < values[index + 2].length; scoreIndex += 2) {
            arrayMatches[currentMatch].team1score = values[index + 2][scoreIndex];
            arrayMatches[currentMatch].team2score = values[index + 3][scoreIndex];
            currentMatch++;
        }
    }    else {
        console.error('Number of scores don\'t match!');
    }

}

function fetchPlayersFromResult(values, arrayMatches, index, lastMatchArray, nicknamesArray) {
    let currentMatch = lastMatchArray;
    if (values[index + 1].length == values[index + 4].length) {
        for (let playersIndex = 0; playersIndex < values[index + 4].length; playersIndex += 2) {
            arrayMatches[currentMatch].player1 = getPlayerByNickname(values[index + 1][playersIndex], nicknamesArray)._id;
            arrayMatches[currentMatch].player2 = getPlayerByNickname(values[index + 1][playersIndex + 1], nicknamesArray)._id;
            arrayMatches[currentMatch].player3 = getPlayerByNickname(values[index + 4][playersIndex], nicknamesArray)._id;
            arrayMatches[currentMatch].player4 = getPlayerByNickname(values[index + 4][playersIndex + 1], nicknamesArray)._id;
            currentMatch++;
        }
    }    else {
        console.error('Number of players don\'t match!');
    }
}

function getPlayerByNickname(player, nicknamesArray) {
    for (let index in nicknamesArray) {
        if (nicknamesArray[index].nickname == getEquivalentNickname(player)) {
            return nicknamesArray[index];
        }
    }
    return 'not found';
}

function getEquivalentNickname(nickname) {
    let equivalent = {
        'Schezar' : 'Junim',
        'Leonardo' : 'Leo'
    }

    return (equivalent[nickname] == null) ? nickname : equivalent[nickname];
}

function getMatchesFromSpreadsheet(auth, monthSheets) {
    let sheets = google.sheets('v4');
    let monthToInclude = '';

    monthSheets.forEach(function (val) {

        // Getting the current month to be included (based on the Sheet name).
        monthToInclude = String(val.match(/\d\d\/\d\d/g));

        // Scaping the values in order to get the proper sheet.
        val = val.replace('/', '%2F');

        sheets.spreadsheets.values.get({
            auth : auth,
            spreadsheetId : SHEETS_ID,
            range : '\'' + val + '\'!O4:AQ60',
            majorDimension : 'COLUMNS'
        }, function (err, response) {
            if (err) {
                console.log('The API returned an error: ' + err);
                return;
            }

            if (response.values == null) {
                console.log('Sheet not Found: ' + val);
                return;
            }

            console.log('GETTING MATCHES FROM MONTH: ' + monthToInclude);
            if (response.values.length > 0) {
                let nicknamesArray = [];
                playerController.getAll().then((responsePlayer) => {
                    nicknamesArray = responsePlayer;

                    // Creating championship
                    let yearToSave = monthToInclude.slice(3);
                    let monthToSave = monthToInclude.slice(0, 2);
                    let championship = new championshipModel({
                        month : monthToSave,
                        year : '20' + yearToSave,
                        date : new Date('20' + yearToSave, monthToSave - 1, 1),
                        isCurrent : false
                    });
                    championshipController.insert(championship).then((championship) => {
                        let arrayMatches = [];
                        let lastMatchArray = 0;
                        // Getting blocks of data gotten from spreadsheet
                        for (let i = 0; i < response.values.length; i += 6) {
                            fetchDatesFromResult(response.values, arrayMatches, i, yearToSave, monthToSave);
                            fetchScoreFromResult(response.values, arrayMatches, i, lastMatchArray);
                            fetchPlayersFromResult(response.values, arrayMatches, i, lastMatchArray, nicknamesArray);
                            lastMatchArray = arrayMatches.length;
                        }

                        for (let j = 0; j < arrayMatches.length; j++) {
                            arrayMatches[j].championship = championship._id;
                            matchController.insert(arrayMatches[j]).then((match) => {
                                console.log('Inserted Match: ' + match);
                            }).catch((error) => {
                                console.log('error' + error);
                            });
                        }
                    }).catch((error) => {
                        console.log('error' + error);
                    });
                });
            }
        });
    });

}
