import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatchService } from "./../match.service";
import { Match } from './../models/Match';
import { PlayerDropdownSelected } from './../models/PlayerDropdownSelected';
import { ChampionshipService } from './../championship.service';

@Component({
  selector: 'app-insert-match',
  templateUrl: './insert-match.component.html',
  styleUrls: ['./insert-match.component.css']
})
export class InsertMatchComponent implements OnInit {

	@Output() onCreateMatchSuccess: EventEmitter<Match> = new EventEmitter();
	match: Match = new Match();
	error: any;
	selected: false;

	constructor(private matchService: MatchService, private championshipService: ChampionshipService) { }

	tryCreateMatch() { 
		if (!this.championshipService.getCurrentChampionship()) {
			this.error = {description: "Verifique se há um campeonato criado."};
			return;
		}
		if (this.verifyRepeatedPlayer()) {
			this.error = {description: "Verifique se há jogadores repetidos."};
			return;
		}

		this.match.championship = this.championshipService.getCurrentChampionship();
		this.match.isFinal = this.selected;

		this.matchService.insert(this.match).subscribe(
			(result) => this.matchCreatedSuccess(result),
			(error : any) => {
				console.log(error);
				this.error = error;
			}
		);
	}

	verifyRepeatedPlayer() {
		if (this.match.player1 === this.match.player2) {
			return true;
		}
		if (this.match.player1 === this.match.player3) {
			return true;
		}
		if (this.match.player1 === this.match.player4) {
			return true;
		}
		if (this.match.player2 === this.match.player3) {
			return true;
		}
		if (this.match.player2 === this.match.player4) {
			return true;
		}
		if (this.match.player3 === this.match.player4) {
			return true;
		}
		return false;
	}

	matchCreatedSuccess(result: Match) {
		this.onCreateMatchSuccess.emit(result);
	}

	handlePlayerSelection(playerSelection: PlayerDropdownSelected){
		this.match[playerSelection.inputName] = playerSelection.selectedValue;
	}

	ngOnInit() { }
}
