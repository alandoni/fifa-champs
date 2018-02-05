import { Player } from './player';
import { Match } from './match';

export class Statistics {
    player : Player;
    matches : number;
    victories : number;
    ties : number;
    defeats : number;
    goals : number;
    concededGoals : number;
    goalBalance : number;
    goalsPerMatch : number;
    concededGoalsPerMatch : number;
    score : number;
    percent : number;

    static getStatisticsFromMatches(matches : Array<Match>, limit : number) : Array<Statistics> {
        if (matches === undefined) {
            return null;
        }

        const players : Array<Player> = this._getPlayersFromMatches(matches);

        const statistics = this._createStatistics(matches, players);

        statistics.sort((statistic1, statistic2) => {
            return this._compareStatistics(limit, statistic1, statistic2);
        });

        return statistics;
    }

    static _getPlayersFromMatches(matches : Array<Match>) : Array<Player> {
        const players = [];
        for (const match of matches) {
            this._addPlayerIfContainsInMatch(players, match.player1);
            this._addPlayerIfContainsInMatch(players, match.player2);
            this._addPlayerIfContainsInMatch(players, match.player3);
            this._addPlayerIfContainsInMatch(players, match.player4);
        }
        return players;
    }

    static _addPlayerIfContainsInMatch(playersList, player) {
        if (playersList.indexOf(player) < 0) {
            playersList.push(player);
        }
    }

    static _createStatistics(matches, players) : Array<Statistics> {
        const statistics = [];

        for (const player of players) {

            if (!player.nickname) {
                continue;
            }

            statistics[player.nickname] = new Statistics();
            statistics[player.nickname].player = player;
        }

        let matchWihtoutFinal : Array<Match>;

        if (Array.isArray(matches)) {
            matchWihtoutFinal = matches.filter(match => match.isFinal === false);
        } else {
            matchWihtoutFinal = new Array<Match>();
        }

        for (const match of matchWihtoutFinal) {
            this._addMatchToStatistics(statistics, match);
        }

        return this._convertFromDictionaryToArray(statistics);
    }

    static _addMatchToStatistics(statistics, match) {
        this._setStatisticOfPlayer(statistics, match.player1, match.team1score, match.team2score);
        this._setStatisticOfPlayer(statistics, match.player2, match.team1score, match.team2score);
        this._setStatisticOfPlayer(statistics, match.player3, match.team2score, match.team1score);
        this._setStatisticOfPlayer(statistics, match.player4, match.team2score, match.team1score);
    }

    static _setStatisticOfPlayer(statistics, player, team1score, team2score) {
        if (!player.nickname) {
            return;
        }

        const statsOfPlayer = statistics[player.nickname];

        statsOfPlayer.player = player;
        statsOfPlayer.matches++;
        statsOfPlayer.goals += team1score;
        statsOfPlayer.concededGoals += team2score;
        statsOfPlayer.goalBalance += team1score - team2score;

        if (team1score > team2score) {
            statsOfPlayer.victories++;
            statsOfPlayer.score += 3;
        } else if (team1score < team2score) {
            statsOfPlayer.defeats++;
        } else {
            statsOfPlayer.ties++;
            statsOfPlayer.score += 1;
        }
        statsOfPlayer.goalsPerMatch = statsOfPlayer.goals * 1.0 / statsOfPlayer.matches;
        statsOfPlayer.concededGoalsPerMatch = statsOfPlayer.concededGoals * 1.0 / statsOfPlayer.matches;
        statsOfPlayer.percent = statsOfPlayer.score / (3 * statsOfPlayer.matches) * 100;
    }

    static _convertFromDictionaryToArray(dictionary) {
        const keys = Object.keys(dictionary);
        return keys.map(function(v) {
            return dictionary[v];
        });
    }

    static _compareStatistics(limit, statistic1, statistic2) {
        if (statistic1.matches >= limit && statistic2.matches < limit) {
            return -1;
        }
        if (statistic1.matches < limit && statistic2.matches >= limit) {
            return 1;
        }

        if (statistic1.percent > statistic2.percent) {
            return -1;
        }
        if (statistic1.percent < statistic2.percent) {
            return 1;
        }

        if ((statistic1.victories / statistic1.matches) > (statistic2.victories / statistic2.matches)) {
            return -1;
        }
        if ((statistic1.victories / statistic1.matches) < (statistic2.victories / statistic2.matches)) {
            return 1;
        }

        if ((statistic1.goalBalance / statistic1.matches) > (statistic2.goalBalance / statistic2.matches)) {
            return -1;
        }
        if ((statistic1.goalBalance / statistic1.matches) < (statistic2.goalBalance / statistic2.matches)) {
            return 1;
        }

        if (statistic1.goalsPerMatch > statistic2.goalsPerMatch) {
            return -1;
        }
        if (statistic1.goalsPerMatch < statistic2.goalsPerMatch) {
            return 1;
        }
        return 0;
    }

    constructor() {
        this.matches = 0;
        this.victories = 0;
        this.ties = 0;
        this.defeats = 0;
        this.goals = 0;
        this.concededGoals = 0;
        this.goalBalance = 0;
        this.goalsPerMatch = 0;
        this.concededGoalsPerMatch = 0;
        this.score = 0;
        this.percent = 0;
    }
}
