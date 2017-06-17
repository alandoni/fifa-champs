const https = require('https');
const cheerioDOMLoader = require('cheerio');
const fs = require('fs');

const BASE_URL = "https://www.fifaindex.com"
const BASE_QUERY = 'SELECT * FROM htmlstring WHERE url="https://www.fifaindex.com/teams/{0}/?type={1}"';
const PARAMS = "&format=json&diagnostics=true&env=store://datatables.org/alltableswithkeys&callback=";

var jsonFile = {};

if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

countDownAsynchronousCalls = {
    count: 0,
    lastCallWasMadeClubs: false,
    lastCallWasMadeInt: false,
    lastCallWasMadeWomen: false,
    lastCallWasMade: function(typeOfTeams) {
        switch(typeOfTeams){
            case 1:
                this.lastCallWasMadeInt = true;
                break;
            case 2:
                this.lastCallWasMadeWomen = true;
                break;
            default:
                this.lastCallWasMadeClubs = true;
                break;
        }
    },
    check: function() {
        this.count--;
        if (this.count == 0) this.calculate();
    },
    calculate: function() {
        if(this.lastCallWasMadeClubs && this.lastCallWasMadeInt && this.lastCallWasMadeWomen){
            jsonFile["oddsForTypesAvailable"] =  ["4.0", "4.5","5.0", "6.0","4.0", "5.0","4.0", "INT 4.5","4.5","4.5","INT 5.0","4.0","6.0", "WMN 4.5", "4.5","5.0"];
            fs.writeFile("resources/teamsFifa17.json", JSON.stringify(jsonFile, null, 2), function(err) {
                if(err) {
                return console.log(err);
                }
            });
        }
    }
};

function getImageFromTeam($collumn){
    return BASE_URL + $collumn.find("img").attr('src').replace("/50/","/256/");
}

function getTeamGeneralParam($collumn){
    return $collumn.children("a").text();
}

function getTeamRatingParam($collumn){
    return $collumn.children("span.rating").text();
}

function getTeamStars($collumn){
    var wholeStar = $collumn.children("span.star").find(".fa-star").length*1.0;
    var halfStar = $collumn.children("span.star").find(".fa-star-half-o").length/2.0;
    return wholeStar + halfStar;
}

function getStringPerTeamType(typeOfTeam){
    switch(typeOfTeam){
        case 1:
            return "INT ";
        case 2:
            return "WMN ";
        default:
            return "";
    }
}

function getAttributesFromTeam($, teamElem, jsonFile, typeOfTeams){
    var team = {};
    var teamsAttributes = teamElem.children("td");
    team.badgeImage = getImageFromTeam($(teamsAttributes.get(0)));
    team.name = getTeamGeneralParam($(teamsAttributes.get(1)));
    team.league =  getTeamGeneralParam($(teamsAttributes.get(2)));
    team.attack =  getTeamRatingParam($(teamsAttributes.get(3)));
    team.midfield =  getTeamRatingParam($(teamsAttributes.get(4)));
    team.defense =  getTeamRatingParam($(teamsAttributes.get(5)));
    team.overall =  getTeamRatingParam($(teamsAttributes.get(6)));
    
    var stars = getStringPerTeamType(typeOfTeams) + getTeamStars($(teamsAttributes.get(7))).toFixed(1);

    if(jsonFile[stars] == null){
        jsonFile[stars] = [];
    }

    jsonFile[stars].push(team);
}

function getTeams($, jsonFile ,typeOfTeams){
    var $teamsTable =  $('table tbody');
    var teamRows = $teamsTable.children("tr").each(function(i,elem){
        getAttributesFromTeam($, $(elem), jsonFile, typeOfTeams);
    });
}

function requestTeamPage(page, typeOfTeams){
    var formattedQuery = BASE_QUERY.format(page, typeOfTeams);
    var url = "https://query.yahooapis.com/v1/public/yql?q="+ encodeURIComponent(formattedQuery) + PARAMS;
    var data = [];
    https.get(url, function(res) {
    countDownAsynchronousCalls.count++;
    if(res.statusCode == 200) {
        res.on('data', (chunk) => {
            data.push(chunk);
        });

        res.on('end', () => {

            data = Buffer.concat(data).toString().replace(/\\n/g,"").replace(/\\/g,"");

            // Get Current Page From HTML
            var $ = cheerioDOMLoader.load(data);
            getTeams($, jsonFile, typeOfTeams);
  
            var $hasNextPage = ($("li.next").not(".disabled").children("a").text().localeCompare("Next Page") == 0);
            if($hasNextPage)
                requestTeamPage(++page, typeOfTeams);
            else{
                countDownAsynchronousCalls.lastCallWasMade(typeOfTeams);
            }

            countDownAsynchronousCalls.check();
            console.log("Number of async calls running:" + countDownAsynchronousCalls.count);
        });
    }

    }).on('error', function(e) {
    console.log("Got error: " + e.message);

    });
}

requestTeamPage(1,0);
requestTeamPage(1,1);
requestTeamPage(1,2);