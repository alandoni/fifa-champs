import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PlayerService } from './../player.service';
import { Player } from './../models/player';
import * as Materialize from 'materialize-css';
declare var $ : any;

@Component({
  selector: 'app-dropdown-player',
  templateUrl: './dropdown-player.component.html',
  styleUrls: ['./dropdown-player.component.css'],
})
export class DropdownPlayerComponent implements OnInit {

	@Output() onChange = new EventEmitter();

	@Input() name : string;
	@Input() label : string;
	@Input() players : Array<Player>;
	@Input() selected : Player;

	names : Array<string>;
	ids : Array<string>;
	selectedId : string;
	initilized = false;

	constructor() {

	}

	change(value) {
		if (!this.initilized) {
			return;
		}
		for (let player of this.players) {
			if (player._id === value) {
				this.selected = player;
				this.onChange.emit({target: this.name, player: player});
				break;
			}
		}
	}

	ngOnInit() {
		this.ids = [];
		this.names = [];
		for (let player of this.players) {
			this.ids.push(player._id);
			this.names.push(player.nickname);
		}
		if (!this.selected) {
			this.selected = this.players[0];
			this.selectedId = this.selected._id;
		} else {
			this.selectedId = this.selected._id;
		}
	}

	ngAfterViewInit() {
		this.initilized = true;
	}
}