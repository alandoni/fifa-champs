import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { LoginService } from './../login.service';
import { ChampionshipService } from './../championship.service';
import { Championship } from './../models/championship';
import { Player } from './../models/player';
import { Match } from './../models/match';
import { MaterializeAction } from 'angular2-materialize';

@Component({
	selector: 'app-navigation-bar',
	templateUrl: './navigation-bar.component.html',
	styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {

	@Output() onLoginSuccess: EventEmitter<any> = new EventEmitter();
	@Output() onLogoutSuccess: EventEmitter<any> = new EventEmitter();
	@Output() onCreateMatchSuccess: EventEmitter<Match> = new EventEmitter();
	@Output() onCreateChampionshipSuccess: EventEmitter<Championship> = new EventEmitter();

	modalActions = new EventEmitter<string|MaterializeAction>();
	matchModalActions = new EventEmitter<string|MaterializeAction>();
	isLoggedIn = false;

	constructor(private loginService : LoginService, private championshipService : ChampionshipService) {
		this.isLoggedIn = loginService.isLoggedIn();
		this.loginService.addListener(this);
	}

	ngOnInit() {

	}

	createMatch() {
		this.matchModalActions.emit({action:"modal", params:['open']});
	}

	closeMatchModal(result) {
		this.matchModalActions.emit({action:"modal", params:['close']});
		this.onCreateMatchSuccess.emit(result);
	}

	onLoginChange() {
		this.isLoggedIn = this.loginService.isLoggedIn();
	}

	logout() {
		this.loginService.logout();
		this.onLogoutSuccess.emit(true);
	}

	openLoginModal() {
		this.modalActions.emit({action:"modal", params:['open']});
	}

	closeLoginModal(result) {
		this.modalActions.emit({action:"modal", params:['close']});
		this.onLoginSuccess.emit(result);
	}

	createSeason() {
		if (!window.confirm("ATENÇÃO!! Tem certeza que quer iniciar um novo campeonato?" + 
			" O campeonato atual não poderá mais ser alterado!")) {
			return;
		}

		if (this.championshipService.getCurrentChampionship()) {
			this.createSeasonBasedOnCurrentSeason(this.championshipService.getCurrentChampionship());
			return;
		}

		this.championshipService.getCurrent().subscribe((current: Championship[]) => {
			if (current.length == 0) {
				var date = new Date();
				console.log("No championships found, creating the first one");
				this.insertChampionship(date.getMonth() + 1, date.getFullYear());
				return;
			}
			console.log("Championships found");
			var currentSeason = current[0];
			this.createSeasonBasedOnCurrentSeason(currentSeason);
		}, (error: any) => {
			console.error(error);
		});
	}

	createSeasonBasedOnCurrentSeason(currentSeason) {
		currentSeason.date = undefined;
		currentSeason.isCurrent = false;

		return this.championshipService.update(currentSeason._id, currentSeason).subscribe((current) => {
			if (current.month == 12) {
				current.year++;
				current.month = 0;
			}

			this.insertChampionship(current.month + 1, current.year);
		}, (error: any) => {
			console.error(error);
		});
	}

	insertChampionship(month, year) {
		var newChampionship = {
			month: month,
			year: year,
			players: undefined,
			matches: undefined,
			finalMatch: undefined,
			_id: undefined,
			date: new Date(),
			isCurrent: true
		};

		this.championshipService.insert(newChampionship).subscribe((newSeason) => {
			this.championshipService.setCurrentChampionship(newSeason);
			alert("Novo campeonato iniciado com sucesso");
			this.onCreateChampionshipSuccess.emit(newSeason);
		}, (error: any) => {
			console.error(error);
		});
	}
}
