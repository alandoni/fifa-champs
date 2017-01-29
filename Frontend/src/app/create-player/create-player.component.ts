import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PlayerService } from "./../player.service";
import { Player } from './../models/Player';

@Component({
	selector: 'app-create-player',
	templateUrl: './create-player.component.html',
	styleUrls: ['./create-player.component.css']
})
export class CreatePlayerComponent implements OnInit {

	@Output() onCreatePlayerSuccess: EventEmitter<Player> = new EventEmitter();

	nickname = "";
	error = null;

	constructor(private playerService: PlayerService) { }

	tryCreatePlayer() { 
		this.playerService.insert(this.nickname).subscribe(
			(result) => this.playerCreatedSuccess(result),
			(error) => {
				console.log(<any>error);
				this.error = <any>error;
			}
		);
	}

	playerCreatedSuccess(result: Player) {
		console.log(result);

		this.onCreatePlayerSuccess.emit(result);
	}

	ngOnInit() { }
}

