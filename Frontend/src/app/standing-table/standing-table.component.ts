import { Component, OnInit, Input } from '@angular/core';
import { Match } from './../models/match';
import { Statistics } from './../models/statistics';
import { Player } from './../models/player';

@Component({
	selector: 'app-standing-table',
	templateUrl: './standing-table.component.html',
	styleUrls: ['./standing-table.component.css']
})
export class StandingTableComponent implements OnInit {

	@Input() matches : Array<Match>;
	@Input() players : Array<Player>;

	@Input() classifiedColor : String;
	@Input() classifiedClass : String;

	statisticsList : Array<Statistics>;
	days;
	numberOfMatches;
	limit;

	constructor() { }

	ngOnInit() {
		if (!this.hasPlayers()) {
			return;
		}
		this.setLimit();
		this.createStatistics();
	}

	createStatistics() {
		if (this.statisticsList && this.statisticsList.length > 0) {
			return;
		}

		var statistics = [];

		for (let player in this.players) {
			let playerObj = this.players[player];
			statistics[playerObj.nickname] = new Statistics();
			statistics[playerObj.nickname].player = playerObj;
		}

		for (let match in this.matches) {
			var m = this.matches[match];
			this.setStatisticOfPlayer(statistics, m.player1, m.team1score, m.team2score);
			this.setStatisticOfPlayer(statistics, m.player2, m.team1score, m.team2score);
			this.setStatisticOfPlayer(statistics, m.player3, m.team2score, m.team1score);
			this.setStatisticOfPlayer(statistics, m.player4, m.team2score, m.team1score);
		}

		this.statisticsList = [];
		for (var key in statistics) {
			this.statisticsList.push(statistics[key]);
		}
		this.statisticsList.sort((statistic1, statistic2) => {
			return this.compareStatistics(statistic1, statistic2);
		});
	}

	compareStatistics(statistic1, statistic2) {
		if (statistic1.matches >= this.limit && statistic2.matches < this.limit) {
			return -1;
		}
		if (statistic1.matches < this.limit && statistic2.matches >= this.limit) {
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

	setStatisticOfPlayer(statistics, player, team1score, team2score) {
		statistics[player.nickname].player = player;
		statistics[player.nickname].matches++;
		statistics[player.nickname].goals += team1score;
		statistics[player.nickname].concededGoals += team2score;

		if (team1score > team2score) {
			statistics[player.nickname].victories++;
			statistics[player.nickname].goalBalance += team1score - team2score;
			statistics[player.nickname].score += 3;
		} else if (team1score < team2score) {
			statistics[player.nickname].defeats++;
			statistics[player.nickname].goalBalance += team2score - team1score;
		} else {
			statistics[player.nickname].ties++;
			statistics[player.nickname].score += 1;
		}
		statistics[player.nickname].goalsPerMatch = statistics[player.nickname].goals / statistics[player.nickname].matches;
		statistics[player.nickname].concededGoalsPerMatch = statistics[player.nickname].concededGoals / statistics[player.nickname].matches;
		statistics[player.nickname].percent = statistics[player.nickname].score / (3 * statistics[player.nickname].matches) * 100;
	}

	setLimit() {
		if (!this.matches && this.matches.length == 0) {
			return;
		}

		var days = [];
		for (let match of this.matches) {
			if (days.indexOf(match.date) < 0) {
				days.push(match.date);
			}
		}
		this.days = days.length;
		this.numberOfMatches = this.matches.length
		this.limit = this.numberOfMatches / this.days;
	}

	hasPlayers() {
		return this.players != null && this.players.length > 0;
	}

	getClassForIndex(index) {
		if (index < 4) {
			return this.classifiedClass;
		}
		return "";
	}

	getColorForIndex(index) {
		if (index < 4) {
			console.log("#" + this.classifiedColor);
			//return this.classifiedColor;
			return "#e3f9e6";
		}
		return "";
	}

	formatNumber(number) {
		return parseFloat(number).toFixed(2);
	}
}
