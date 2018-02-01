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

	static getStatisticsFromMatches(matches: Array<Match>, limit : number) : Array<Statistics> {
		const players : Array<Player> = this._getPlayersFromMatches(matches);

		let statistics = this._createStatistics(matches, players);

		statistics.sort((statistic1, statistic2) => {
			return this._compareStatistics(limit, statistic1, statistic2);
		});

		return statistics;
	}

	static _getPlayersFromMatches(matches : Array<Match>) : Array<Player> {
		let players = [];
		for (let matchIndex in matches) {
			const match = matches[matchIndex];
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
		let statistics = [];

		for (let player in players) {
			let playerObj = players[player];

			if (!playerObj.nickname) {
				continue;
			}

			statistics[playerObj.nickname] = new Statistics();
			statistics[playerObj.nickname].player = playerObj;
		}

		let matchWihtoutFinal : Array<Match>;

		if (Array.isArray(matches)) {
			matchWihtoutFinal = matches.filter(match => match.isFinal == false);
		} else {
			matchWihtoutFinal = new Array<Match>();
		}

		for (let match in matchWihtoutFinal) {
			let m = matchWihtoutFinal[match];
			this._setStatisticOfPlayer(statistics, m.player1, m.team1score, m.team2score);
			this._setStatisticOfPlayer(statistics, m.player2, m.team1score, m.team2score);
			this._setStatisticOfPlayer(statistics, m.player3, m.team2score, m.team1score);
			this._setStatisticOfPlayer(statistics, m.player4, m.team2score, m.team1score);
		}

		return statistics;
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

	static _setStatisticOfPlayer(statistics, player, team1score, team2score) {
		if (!player.nickname) {
			return;
		}
		statistics[player.nickname].player = player;
		statistics[player.nickname].matches++;
		statistics[player.nickname].goals += team1score;
		statistics[player.nickname].concededGoals += team2score;
		statistics[player.nickname].goalBalance += team1score - team2score;

		if (team1score > team2score) {
			statistics[player.nickname].victories++;
			statistics[player.nickname].score += 3;
		} else if (team1score < team2score) {
			statistics[player.nickname].defeats++;
		} else {
			statistics[player.nickname].ties++;
			statistics[player.nickname].score += 1;
		}
		statistics[player.nickname].goalsPerMatch = statistics[player.nickname].goals*1.0 / statistics[player.nickname].matches;
		statistics[player.nickname].concededGoalsPerMatch = statistics[player.nickname].concededGoals*1.0 / statistics[player.nickname].matches;
		statistics[player.nickname].percent = statistics[player.nickname].score / (3 * statistics[player.nickname].matches) * 100;
	}
}
