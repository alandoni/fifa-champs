import { Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';
import { Match } from './../models/match';

@Component({
	selector: 'app-match-list',
	templateUrl: './match-list.component.html',
	styleUrls: ['./match-list.component.css']
})
export class MatchListComponent implements OnChanges {

	@Input() matches: Array<Match>;
	@Input() minItemsPerColumn = 6;
	@Input() cols = 1;

	matchModalActions = new EventEmitter<string|MaterializeAction>();

	error: any;
	matchesList: Array<Array<Match>>;

	matchToEdit: Match;

	constructor() { }

	ngOnChanges(changes: SimpleChanges) {
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
		var lastMatchDate = "";
		for (var i = 0; i < this.cols; i++) {
			var matchCol = [];
			for (var j = 0; (j < this.minItemsPerColumn || j < numberOfMatchesPerColumn) && matchIndex < this.matches.length; j++) {
				matchCol.push(this.matches[matchIndex]);

				if (this.matches[matchIndex].date === lastMatchDate) {
					this.matches[matchIndex].date = undefined;
				} else {
					lastMatchDate = this.matches[matchIndex].date;
				}
				matchIndex++;
			}
			this.matchesList.push(matchCol);
			lastMatchDate = this.matches[matchIndex - 1].date;
		}
	}

	onEditMatch(match) {
		this.matchToEdit = match;
		this.matchModalActions.emit({action: 'modal', params: ['open']});
	}

	closeMatchModal(result) {
		this.matchToEdit = result;
		this.matchModalActions.emit({action: 'modal', params: ['close']});
	}
}
