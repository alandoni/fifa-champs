import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatchService } from "./../match.service";
import { Match } from './../models/Match';
import { PlayerDropdownSelected } from './../models/PlayerDropdownSelected';
@Component({
  selector: 'app-insert-match',
  templateUrl: './insert-match.component.html',
  styleUrls: ['./insert-match.component.css']
})
export class InsertMatchComponent implements OnInit {

	@Output() onCreateMatchSuccess: EventEmitter<Match> = new EventEmitter();

	match = new Match();
	error;

	constructor(private matchService: MatchService) { }

	tryCreateMatch() { 
		console.log(this.match);
		this.matchService.insert(this.match).subscribe(
			(result) => this.matchCreatedSuccess(result),
			(error) => {
				console.log(<any>error);
				this.error = <any>error;
			}
		);
	}

	matchCreatedSuccess(result: Match) {
		console.log(result);

		this.onCreateMatchSuccess.emit(result);
	}

	handlePlayerSelection(playerSelection: PlayerDropdownSelected){
		this.match[playerSelection.inputName] = playerSelection.selectedValue;
	}

	ngOnInit() { }
}
