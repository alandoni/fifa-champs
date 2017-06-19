const https = require('https');
const cheerioDOMLoader = require('cheerio');
const fs = require('fs');

const BASE_URL = "https://www.fifaindex.com"
const BASE_QUERY = 'SELECT * FROM htmlstring WHERE url="https://www.fifaindex.com/teams/{0}/?type={1}"';
const PARAMS = "&format=json&diagnostics=true&env=store://datatables.org/alltableswithkeys&callback=";

let jsonFile = {};

/* This allows to replace {0}, {1}, etc type of 
    placeholders with strings I want them to be replaced with */
const formatString = function () {
    let args = Array.prototype.slice.call(arguments).slice(1);
    return arguments[0].replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
    });
}

const TYPE_OF_TEAMS = {
    CLUBS: 0,
    INTERNATIONAL_TEAMS: 1,
    WOMEN_INTERNATIONAL: 2
}

/* Organize the number of asynchronous calls being executed at the same time
   It will save the file only when all calls were requested, and finished */
let countDownAsynchronousCalls = {
    count: 0,
    lastCallWasMadeClubs: false,
    lastCallWasMadeInt: false,
    lastCallWasMadeWomen: false,
    lastCallWasMade: function (typeOfTeams) {
        /* Since International, Women and Clubs are separate things on the website,
           the requests are separated as well, so we need a control over which type of team were already finished
           and save the file only when all of them were done */
        switch (typeOfTeams) {
            case TYPE_OF_TEAMS.INTERNATIONAL_TEAMS:
                this.lastCallWasMadeInt = true;
                break;
            case TYPE_OF_TEAMS.WOMEN_INTERNATIONAL:
                this.lastCallWasMadeWomen = true;
                break;
            default:
                this.lastCallWasMadeClubs = true;
                break;
        }
    },
    check: function () {
        this.count--;
        if (this.count == 0) this.calculate();
    },
    calculate: function () {
        if (this.lastCallWasMadeClubs && this.lastCallWasMadeInt && this.lastCallWasMadeWomen) {
            /* This is saved to keep a list of odds of when a specific star will be selected
               A refactor on the way this is implemented will happen soon.
            */
            jsonFile["oddsForTypesAvailable"] = ["2.5","4.0", "5.0", "3.0", "3.5", "4.5","4.0","0.5","WMN 4.5",
             "WMN 4.0","4.5", "INT 4.5","1.0", "INT 5.0", "INT 4.0","1.5","5.0","1.0","4.5","2.0", "5.0", "4.0"];
            fs.writeFile("resources/teamsFifa17.json", JSON.stringify(jsonFile, null, 2), function (err) {
                if (err) {
                    return console.log(err);
                }
            });
        }
    }
};

function getImageFromTeam($collumn) {
    return BASE_URL + $collumn.find("img").attr('src');
}

function getTeamGeneralParam($collumn) {
    return $collumn.children("a").text();
}

function getTeamRatingParam($collumn) {
    return $collumn.children("span.rating").text();
}

function getTeamStars($collumn) {
    /* Self-explained, but the class of the element inside span determine how many stars a team has */
    let wholeStar = $collumn.children("span.star").find(".fa-star").length * 1.0;
    let halfStar = $collumn.children("span.star").find(".fa-star-half-o").length / 2.0;
    return wholeStar + halfStar;
}

function getStringPerTeamType(typeOfTeam) {
    /* It will switch the "stars" name with the proper type of team: Women (WMN), International (INT) or Clubs */
    switch (typeOfTeam) {
        case TYPE_OF_TEAMS.INTERNATIONAL_TEAMS:
            return "INT ";
        case TYPE_OF_TEAMS.WOMEN_INTERNATIONAL:
            return "WMN ";
        default:
            return "";
    }
}

function getAttributesFromTeam($, teamElem, jsonFile, typeOfTeams) {
    /* The variable "$" is passed here and on other functions in order to be able to use the cheerio context properly */
    let team = {};
    let teamsAttributes = teamElem.children("td");
    team.badgeImage = getImageFromTeam($(teamsAttributes.get(0)));
    team.name = getTeamGeneralParam($(teamsAttributes.get(1)));
    team.league = getTeamGeneralParam($(teamsAttributes.get(2)));
    team.attack = getTeamRatingParam($(teamsAttributes.get(3)));
    team.midfield = getTeamRatingParam($(teamsAttributes.get(4)));
    team.defense = getTeamRatingParam($(teamsAttributes.get(5)));
    team.overall = getTeamRatingParam($(teamsAttributes.get(6)));

    let stars = getStringPerTeamType(typeOfTeams) + getTeamStars($(teamsAttributes.get(7))).toFixed(1);

    if (jsonFile[stars] == null) {
        jsonFile[stars] = [];
    }

    jsonFile[stars].push(team);
}

function getTeams($, jsonFile, typeOfTeams) {
    let $teamsTable = $('table tbody');
    $teamsTable.children("tr").each(function (i, elem) {
        getAttributesFromTeam($, $(elem), jsonFile, typeOfTeams);
    });
}

function requestTeamPage(page, typeOfTeams) {
    let formattedQuery = formatString(BASE_QUERY, page, typeOfTeams);
    let url = "https://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(formattedQuery) + PARAMS;
    let data = [];
    https.get(url, function (res) {
        if (res.statusCode == 200) {
            countDownAsynchronousCalls.count++;
            res.on('data', (chunk) => {
                data.push(chunk);
            });

            res.on('end', () => {

                // Remove any \n and escaped \ that is gotten from the request.
                data = Buffer.concat(data).toString().replace(/\\n/g, "").replace(/\\/g, "");

                // Get Current Page From HTML inside Cheerio's context.
                let $ = cheerioDOMLoader.load(data);

                // Where the magic happens
                getTeams($, jsonFile, typeOfTeams);

                /* If this element exists, then has a next page for the current type of team.
                   Condition to stop the recursive algorithm is here.
                   Mainly "When it does not have more pages".
                */
                let $hasNextPage = ($("li.next").not(".disabled").children("a").text().localeCompare("Next Page") == 0);
                if ($hasNextPage)
                    requestTeamPage(++page, typeOfTeams);
                else {
                    countDownAsynchronousCalls.lastCallWasMade(typeOfTeams);
                }

                countDownAsynchronousCalls.check();
            });
        }

    }).on('error', function (e) {
        console.log("Got error: " + e.message);

    });
}

/* Call the functions for Clubs (typeOfTeam=0), 
                          International Teams (typeOfTeam=1), 
                          and Women International (typeOfTeam=2) */
requestTeamPage(1, TYPE_OF_TEAMS.CLUBS);
requestTeamPage(1, TYPE_OF_TEAMS.INTERNATIONAL_TEAMS);
requestTeamPage(1, TYPE_OF_TEAMS.WOMEN_INTERNATIONAL);