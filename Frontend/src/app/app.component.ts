import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Player } from './models/player';
import { Match } from './models/match';
import { Championship } from './models/championship';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'app works!';

	constructor(private router: Router) {
	}

	loginSuccess(user) {
		//TODO handle login success here
	}

	createPlayerSuccess(user: Player) {
		//TODO handle login success here
	}

	matchCreated(result: Match) {
		//GAMBIARRA BECAUSE I CAN

		var url = 'classification';
		if (window.location.href.indexOf('results') > 0) {
			url = 'results';
		}

		if (window.location.href.indexOf(result.championship._id) > 0) {
			this.router.navigateByUrl('season/' + url + '/' + result.championship.month + '/' + result.championship.year);
			return;
		}
		this.router.navigateByUrl('season/' + url + '/' + result.championship._id);
	}

	championshipCreated(result: Championship) {
		this.router.navigateByUrl('season/classification/' + result._id);
	}
}
