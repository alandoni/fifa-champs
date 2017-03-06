import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Match } from './../models/match';

@Component({
	selector: 'app-match-list',
	templateUrl: './match-list.component.html',
	styleUrls: ['./match-list.component.css']
})
export class MatchListComponent implements OnChanges {

	@Input() matches: Array<Match>;
	@Input() cols = 1;
	error: any;
	matchesList: Array<Array<Match>>;

	constructor() { }

	ngOnChanges() {
		this.matchesList = [];

		if (!this.matches || this.matches.length == 0) {
			this.error = {description: "Nenhum jogo encontrado"};
			return;
		}

		this.error = null;

		this.cols = Math.min(Math.max(1, Math.round(Math.abs(this.cols))), 4);

		var mod = this.matches.length % this.cols;

		var numberOfMatchesPerColumn = Math.floor(this.matches.length / (this.cols - 1));

		if (mod == 0) {
			numberOfMatchesPerColumn = Math.floor(this.matches.length / this.cols);
		}
		if (numberOfMatchesPerColumn == 0) {
			numberOfMatchesPerColumn++;
		}

		var matchIndex = 0;
		for (var i = 0; i < this.cols; i++) {
			var matchCol = [];
			for (var j = 0; j < numberOfMatchesPerColumn && matchIndex < this.matches.length; j++) {
				matchCol.push(this.matches[matchIndex]);
				matchIndex++;
			}
			this.matchesList.push(matchCol);
		}
	}

}
