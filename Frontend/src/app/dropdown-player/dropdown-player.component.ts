import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PlayerService } from "./../player.service";
import { Player } from './../models/Player';
import { PlayerDropdownSelected } from './../models/PlayerDropdownSelected';
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'app-dropdown-player',
  templateUrl: './dropdown-player.component.html',
  styleUrls: ['./dropdown-player.component.css']
})
export class DropdownPlayerComponent implements OnInit {

	@Output() onSelectedPlayer: EventEmitter<PlayerDropdownSelected> = new EventEmitter();
	@Input() name : string;

	players: Array<Player>;
	selected: string;
	error: any;

	constructor(private playerService: PlayerService) { }

	getDropdownValues(filter? : string) { 
		this.playerService.getAll().subscribe(
			(result) => {
				this.players = result;
				this.playerSelected(this.players[0]._id);
			},
			(error: any) => {
				console.log(error);
				this.error = error;
			}
		);
	}

	playerSelected(_id: string) {
		this.selected = _id;
		this.onSelectedPlayer.emit({inputName: this.name, selectedValue: _id});
	}

	ngOnInit() { this.getDropdownValues(); }

}
