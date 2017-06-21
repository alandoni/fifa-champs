import { Component, OnInit, Output, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { PlayerService } from "./../player.service";
import { Player } from './../models/player';

@Component({
	selector: 'app-create-player',
	templateUrl: './create-player.component.html',
	styleUrls: ['./create-player.component.css']
})
export class CreatePlayerComponent implements OnInit, OnChanges {

	@Output() onCreatePlayerSuccess: EventEmitter<Player> = new EventEmitter();
	@Input() player: Player;

	nickname = "";
	error = null;

	constructor(private playerService: PlayerService) { }

	tryCreatePlayer() {
		if (this.player) {
			this.tryUpdatePlayer();
			return;
		}

		this.playerService.insert(this.nickname).subscribe(
			(result) => this.playerCreatedSuccess(result),
			(error) => {
				console.log(<any>error);
				this.error = <any>error;
			}
		);
	}

	tryUpdatePlayer() {
		this.playerService.update(this.player._id, this.nickname, null).subscribe(
			(result) => this.playerCreatedSuccess(result),
			(error) => {
				console.log(<any>error);
				this.error = <any>error;
			}
		);
	}

	playerCreatedSuccess(result: Player) {
		this.onCreatePlayerSuccess.emit(result);
		this.nickname = '';
	}

	ngOnInit() { }

	ngOnChanges(changes: SimpleChanges) {

		if (changes['player'].currentValue) {
			this.nickname = changes['player'].currentValue.nickname;
		} else {
			this.nickname = "";
		}
	}
}
