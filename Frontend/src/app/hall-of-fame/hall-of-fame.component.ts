import { Component, OnInit } from '@angular/core';
import { MatchService } from './../match.service';
import { Match } from './../models/match';

@Component({
	selector: 'app-hall-of-fame',
	templateUrl: './hall-of-fame.component.html',
	styleUrls: ['./hall-of-fame.component.css']
})
export class HallOfFameComponent implements OnInit {

	private matches : Array<Match>;
	private champions = [];
	private error;

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

		for (var key in champions) {
			this.champions.push({
				name: key,
				times: champions[key]
			})
		}
	}
}
