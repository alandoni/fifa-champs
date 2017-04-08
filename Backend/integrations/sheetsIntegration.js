"use strict"

var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

var SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
var TOKEN_DIR = 'resources/';
var TOKEN_PATH = TOKEN_DIR + 'credentials_sheets.json';
var SECRET_PATH = TOKEN_DIR + 'client_secret_sheets.json';

var SHEETS_ID = '1QfszMcuwleISfdd63pmUWavtnH6LCXhY_tWhnHerJ4g';
var sheetMonths = process.argv.slice(2);

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
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

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
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
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

function getMatchesFromSpreadsheet(auth, monthSheets) {
  var sheets = google.sheets('v4');
  var monthToInclude;
  
  monthSheets.forEach(function(val) {

    // Getting the current month to be included (based on the Sheet name).
    monthToInclude = val.match(/\d\d\/\d\d/g);

    // Scaping the values in order to get the proper sheet.
    val = val.replace("/","%2F");

    sheets.spreadsheets.values.get({
      auth: auth,
      spreadsheetId: SHEETS_ID,
      range: "'"+val+"'!O4:AQ47",
      majorDimension: 'COLUMNS'
    }, function (err, response) {
      if (err) {
        console.log('The API returned an error: ' + err);
        return;
      }
      
      if (response.values == undefined) {
        console.log('Sheet not Found: ' + val);
        return;
      }

      console.log("GETTING MATCHES FROM MONTH: "+ monthToInclude);
      if(response.values.length > 0) {

      }
    });
  });

}