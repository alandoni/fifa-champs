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
        this.matchService.getFinals().subscribe((finalMatches) => {
            this.finalMatches = finalMatches;
            this.processPlayers();
        }, (error : any) => {
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
        const playersFromMatch = [];
        playersFromMatch.push(match.player1.nickname);
        playersFromMatch.push(match.player2.nickname);
        playersFromMatch.push(match.player3.nickname);
        playersFromMatch.push(match.player4.nickname);
        return playersFromMatch;
    }

    extractDecisiveScoreFrom(match) : Array<Number> {
        const scores = [];
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
        for (const matchesIndex in this.finalMatches) {
            if (this.finalMatches[matchesIndex]) {
                const finalMatch = this.finalMatches[matchesIndex];

                const playersFromFinal = this.extractPlayersFrom(finalMatch);

                for (const playersIndex in playersFromFinal) {
                    if (playersFromFinal[playersIndex]) {
                        this.initializeCounters(champions, runnerups, playersFromFinal[playersIndex]);
                    }
                }

                const scores = this.extractDecisiveScoreFrom(finalMatch);

                this.processFinal(scores, playersFromFinal, champions, runnerups);
            }
        }
    }

    processFinals() {
        const champions = {};
        const runnerups = {};

        if (!this.finalMatches || this.finalMatches.length === 0) {
            this.error = {
                'description' : 'Nenhum campeonato foi terminado ainda.'
            };
            return;
        }

        this.getChampionsAndRunnerups(champions, runnerups);

        this.champions = [];

        for (const championsKey in champions) {
            if (champions[championsKey]) {
                this.champions.push({
                    'name' : championsKey,
                    'times' : champions[championsKey],
                    'runnerup' : runnerups[championsKey],
                    'firstPlace' : this.firsts[championsKey],
                    'secondPlace' : this.seconds[championsKey]
                });
            }
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
        this.championshipService.getAll().subscribe((seasons) => {
            for (const seasonsIndex in seasons) {
                if ((seasons[seasonsIndex].players.length > 1) && (!seasons[seasonsIndex].isCurrent)) {
                    const firstPlayer = seasons[seasonsIndex].players[0];
                    const secondPlayer = seasons[seasonsIndex].players[1];
                    if (!this.firsts[firstPlayer.nickname]++) {
                        this.firsts[firstPlayer.nickname] = 1;
                    }
                    if (!this.seconds[secondPlayer.nickname]++) {
                        this.seconds[secondPlayer.nickname] = 1;
                    }
                }

            }
            this.processFinals();
        });
    }
}
