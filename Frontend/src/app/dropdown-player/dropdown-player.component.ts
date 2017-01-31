import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PlayerService } from "./../player.service";
import { Player } from './../models/Player';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
@Component({
  selector: 'app-dropdown-player',
  templateUrl: './dropdown-player.component.html',
  styleUrls: ['./dropdown-player.component.css']
})
export class DropdownPlayerComponent implements OnInit {

@Output() onSelectedPlayer: EventEmitter<Player> = new EventEmitter();

	nickname = "";
	error = null;

	constructor(private playerService: PlayerService) { }

	getDropdownValues(filter? : string) { 
		this.playerService.getAll().subscribe(
			(result) => result,
			(error) => {
				console.log(<any>error);
				this.error = <any>error;
			}
		);
	}

	playerCreatedSuccess(result: Player) {
		console.log(result);

		this.onSelectedPlayer.emit(result);
	}

	ngOnInit() { }

}
