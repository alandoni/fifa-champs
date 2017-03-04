import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ChangeDetectorRef, NgZone } from '@angular/core';
import { PlayerService } from "./../player.service";
import { Player } from './../models/Player';
import { PlayerDropdownSelected } from './../models/PlayerDropdownSelected';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-dropdown-player',
  templateUrl: './dropdown-player.component.html',
  styleUrls: ['./dropdown-player.component.css']
})
export class DropdownPlayerComponent implements OnInit, OnChanges {

	@Output() onSelectedPlayer: EventEmitter<PlayerDropdownSelected> = new EventEmitter();
	@Input() name : string;
	@Input() label : string;
	@Input() players : Array<Player>;

	selected: string;
	error: any;

	constructor(private cdRef: ChangeDetectorRef, private ngZone: NgZone) { }

	playerSelected(_id: string) {
		this.selected = _id;
		this.onSelectedPlayer.emit({inputName: this.name, selectedValue: _id});
	}

	ngOnInit() { }

	ngOnChanges() {
		if (this.players) {
			this.playerSelected(this.players[this.players.length - 1]._id);
		}
	}
}
