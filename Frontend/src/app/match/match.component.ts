import { Component, OnInit, Input } from '@angular/core';
import { Match } from './../models/match';

@Component({
	selector: 'app-match',
	templateUrl: './match.component.html',
	styleUrls: ['./match.component.css']
})
export class MatchComponent implements OnInit {

	@Input() match: Match;
	hasPenalties: boolean;

	constructor() { }

	ngOnInit() {
		this.hasPenalties = this.match.isFinal && (this.match.team1penalties > 0 || this.match.team2penalties);
	}

	getWinnerTeamIndex() {
		if (this.match.team1score > this.match.team2score) {
			return 1;
		}
		if (this.match.team1score < this.match.team2score) {
			return 2;
		}
		if (this.match.isFinal) {
			if (this.match.team1penalties > this.match.team2penalties) {
				return 1;
			}
			if (this.match.team1penalties < this.match.team2penalties) {
				return 2;
			}
		}
		return 0;
	}
}
