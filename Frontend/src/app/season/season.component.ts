import { Component, OnInit, Input } from '@angular/core';
import { Match } from './../models/match';
import { Player } from './../models/player';

@Component({
	selector: 'app-season',
	templateUrl: './season.component.html',
	styleUrls: ['./season.component.css']
})
export class SeasonComponent implements OnInit {

	@Input() matches : Array<Match>;
	@Input() players : Array<Player>;

	tab = 0;

	constructor() { 
	}

	changeTab(tabIndex) {
		this.tab = tabIndex;
	}

	ngOnInit() {
	}

}
