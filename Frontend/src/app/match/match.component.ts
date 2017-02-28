import { Component, OnInit, Input } from '@angular/core';
import { Match } from './../models/match';

@Component({
	selector: 'app-match',
	templateUrl: './match.component.html',
	styleUrls: ['./match.component.css']
})
export class MatchComponent implements OnInit {

	@Input() match: Match;

	constructor() { }

	ngOnInit() {
	}

	getWinnerTeamIndex() {
		if (this.match.team1score > this.match.team2score) {
			return 1;
		}
		if (this.match.team1score < this.match.team2score) {
			return 2;
		}
		return 0;
	}
}
