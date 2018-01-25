import { Component, OnInit } from '@angular/core';
import { MatchService } from './../match.service';
import { Match } from './../models/match';
import { ChampionshipService } from './../championship.service';

@Component({
	selector: 'app-hall-of-fame',
	templateUrl: './hall-of-fame.component.html',
	styleUrls: ['./hall-of-fame.component.css']
})
export class HallOfFameComponent implements OnInit {

	finalMatches : Array<Match>;
	champions = [];
	firsts = {};
	seconds = {};
	error;

	constructor(private matchService : MatchService, private championshipService : ChampionshipService) { }

	ngOnInit() {
		this.matchService.getFinals().subscribe(
			(finalMatches) => {
				this.finalMatches = finalMatches;
				this.processPlayers();
			},
			(error : any) => {
				console.log(error);
				this.error = error;
			});
	}

    initializeCounters(champions, runnerups, playerName) {
        if (!champions[playerName]) {
            champions[playerName] = 0;
        }
        if (!runnerups[playerName]) {
            runnerups[playerName] = 0;
        }
    }

    processFinal(scores, players, champions, runnerups) {
        if (scores[0] > scores[1]) {
            champions[players[0]]++;
            champions[players[1]]++;
            runnerups[players[2]]++;
            runnerups[players[3]]++;
        } else {
            runnerups[players[0]]++;
            runnerups[players[1]]++;
            champions[players[2]]++;
            champions[players[3]]++;
        }
    }

    extractPlayersFrom(match) : Array<String> {
        let playersFromMatch = [];
        playersFromMatch.push(match.player1.nickname);
        playersFromMatch.push(match.player2.nickname);
        playersFromMatch.push(match.player3.nickname);
        playersFromMatch.push(match.player4.nickname);
        return playersFromMatch;
    }

    extractDecisiveScoreFrom(match) : Array<Number> {
        let scores = [];
        if (match.team1penalties) {
            scores.push(match.team1penalties);
            scores.push(match.team2penalties);
        } else {
            scores.push(match.team1score);
            scores.push(match.team2score);
        }
        return scores;
    }

    getChampionsAndRunnerups(champions, runnerups) {
        for (let index in this.finalMatches) {
            let finalMatch = this.finalMatches[index];

            let playersFromFinal = this.extractPlayersFrom(finalMatch);

            for (index in playersFromFinal) {
                this.initializeCounters(champions, runnerups, playersFromFinal[index]);
            }

            let scores = this.extractDecisiveScoreFrom(finalMatch);

            this.processFinal(scores, playersFromFinal, champions, runnerups);
        }
    }

	processFinals() {
		let champions = {};
		let runnerups = {};

		if (!this.finalMatches || this.finalMatches.length == 0) {
			this.error = {
                "description" : 'Nenhum campeonato foi terminado ainda.'
            };
			return;
		}

        this.getChampionsAndRunnerups(champions, runnerups);

		this.champions = [];

		for (let key in champions) {
			this.champions.push({
				"name" : key,
				"times" : champions[key],
				"runnerup" : runnerups[key],
				"firstPlace" : this.firsts[key],
				"secondPlace" : this.seconds[key]
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

	processPlayers() {
		this.championshipService.getAll().subscribe(
			(championships) => {
				for (let index in championships) {
                    let firstPlayer = championships[index].players[0];
                    let secondPlayer = championships[index].players[1];

					if (!this.firsts[firstPlayer]++) {
                        this.firsts[firstPlayer] = 1;
                    }
                    if (!this.seconds[secondPlayer]++) {
                        this.seconds[secondPlayer] = 1;
                    }

				}
				this.processFinals();
			}
		)
	}
}
