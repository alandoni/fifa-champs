import { Component, OnInit } from '@angular/core';
import { MatchService } from './../match.service';
import { Match } from './../models/match';

@Component({
	selector: 'app-hall-of-fame',
	templateUrl: './hall-of-fame.component.html',
	styleUrls: ['./hall-of-fame.component.css']
})
export class HallOfFameComponent implements OnInit {

	finalMatches : Array<Match>;
	champions = [];
	error;

	constructor(private matchService : MatchService) { }

	ngOnInit() {
		this.matchService.getFinals().subscribe(
			(finalMatches) => {
				this.finalMatches = finalMatches;
				this.processFinals();
			},
			(error : any) => {
				console.log(error);
				this.error = error;
			});
	}

	processFinals() {
		var champions = {};
		var runnerups = {};

		if (!this.finalMatches || this.finalMatches.length == 0) {
			this.error = {description: 'Nenhum campeonato foi terminado ainda.'};
			return;
		}

		for (var index in this.finalMatches) {
			var finalMatch = this.finalMatches[index];

			if (!champions[finalMatch.player1.nickname]) {
				champions[finalMatch.player1.nickname] = 0;
			}
			if (!champions[finalMatch.player2.nickname]) {
				champions[finalMatch.player2.nickname] = 0;
			}
			if (!champions[finalMatch.player3.nickname]) {
				champions[finalMatch.player3.nickname] = 0;
			}
			if (!champions[finalMatch.player4.nickname]) {
				champions[finalMatch.player4.nickname] = 0;
			}

			if (!runnerups[finalMatch.player1.nickname]) {
				runnerups[finalMatch.player1.nickname] = 0;
			}
			if (!runnerups[finalMatch.player2.nickname]) {
				runnerups[finalMatch.player2.nickname] = 0;
			}
			if (!runnerups[finalMatch.player3.nickname]) {
				runnerups[finalMatch.player3.nickname] = 0;
			}
			if (!runnerups[finalMatch.player4.nickname]) {
				runnerups[finalMatch.player4.nickname] = 0;
			}

			if (finalMatch.team1score > finalMatch.team2score) {
				champions[finalMatch.player1.nickname] += 1;
				champions[finalMatch.player2.nickname] += 1;
				runnerups[finalMatch.player3.nickname] += 1;
				runnerups[finalMatch.player4.nickname] += 1;
			}
			else if (finalMatch.team2score > finalMatch.team1score) {
				runnerups[finalMatch.player1.nickname] += 1;
				runnerups[finalMatch.player2.nickname] += 1;
				champions[finalMatch.player3.nickname] += 1;
				champions[finalMatch.player4.nickname] += 1;
			}
			else{
				if(finalMatch.team1penalties > finalMatch.team2penalties){
					champions[finalMatch.player1.nickname] += 1;
					champions[finalMatch.player2.nickname] += 1;
					runnerups[finalMatch.player3.nickname] += 1;
					runnerups[finalMatch.player4.nickname] += 1;
				}
				else if(finalMatch.team2penalties > finalMatch.team1penalties){
					runnerups[finalMatch.player1.nickname] += 1;
					runnerups[finalMatch.player2.nickname] += 1;
					champions[finalMatch.player3.nickname] += 1;
					champions[finalMatch.player4.nickname] += 1;
				}
			}
		}

		this.champions = [];
		for (var key in champions) {
			this.champions.push({
				name: key,
				times: champions[key],
				runnerup: runnerups[key]
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
