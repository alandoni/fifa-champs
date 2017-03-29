import { Component, OnInit } from '@angular/core';
import { MatchService } from './../match.service';
import { Match } from './../models/match';

@Component({
	selector: 'app-hall-of-fame',
	templateUrl: './hall-of-fame.component.html',
	styleUrls: ['./hall-of-fame.component.css']
})
export class HallOfFameComponent implements OnInit {

	matches : Array<Match>;
	champions = [];
	error;

	constructor(private matchService : MatchService) { }

	ngOnInit() {
		this.matchService.getFinals().subscribe(
			(res) => {
				this.processMatches(res);
			},
			(error : any) => {
				console.log(error);
				this.error = error;
			});
	}

	processMatches(matches : Array<Match>) {

		this.matches = matches;

		var champions = {};

		if (!this.matches || this.matches.length == 0) {
			this.error = {description: 'Nenhum campeonato foi terminado ainda.'};
			return;
		}

		for (var index in matches) {
			var match = matches[index];

			if (!champions[match.player1.nickname]) {
				champions[match.player1.nickname] = 0;
			}
			if (!champions[match.player2.nickname]) {
				champions[match.player2.nickname] = 0;
			}
			if (!champions[match.player3.nickname]) {
				champions[match.player3.nickname] = 0;
			}
			if (!champions[match.player4.nickname]) {
				champions[match.player4.nickname] = 0;
			}

			if (match.team1score > match.team2score) {
				champions[match.player1.nickname] = champions[match.player1.nickname] + 1;
				champions[match.player2.nickname] = champions[match.player2.nickname] + 1;
			}
			if (match.team2score > match.team1score) {
				champions[match.player3.nickname] = champions[match.player3.nickname] + 1;
				champions[match.player4.nickname] = champions[match.player4.nickname] + 1;
			}
		}

		this.champions = [];
		for (var key in champions) {
			this.champions.push({
				name: key,
				times: champions[key]
			})
		}

		this.champions.sort((champion1, champion2) => {
			if (champion1.times > champion2.times) {
				return -1;
			}
			if (champion1.times < champion2.times) {
				return 1;
			}
			return 0;
		});
	}
}
