import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { LoginService } from './../login.service';
import { ChampionshipService } from './../championship.service';
import { Championship } from './../models/championship';
import { MatchService } from './../match.service';
import { Match } from './../models/match';
import { MaterializeAction } from 'angular2-materialize';
import { NavigationBarItem } from './../models/navigation-bar-item.model';

declare var $ : any;

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
	teamPickModalActions = new EventEmitter<string|MaterializeAction>();
	isLoggedIn = false;
	items : Array<NavigationBarItem> = [];

	constructor(private loginService : LoginService, private championshipService : ChampionshipService, private matchService : MatchService) {
		this.loginService.addListener(this);
		this.onLoginChange();
	}

	getItemsNotLogged() {
		var itemsNotLogged = [];
		itemsNotLogged.push(new NavigationBarItem('Login', null, this.openLoginModal.bind(this)));
		itemsNotLogged.push(new NavigationBarItem('Hall of fame', '/hall', null));
		itemsNotLogged.push(new NavigationBarItem('Temporada', '/season/standings/current', null));
		itemsNotLogged.push(new NavigationBarItem('Escolher times', '/team-pick', this.teamPick.bind(this)));
		return itemsNotLogged;
	}

	getItemsLogged() {
		var itemsLogged = [];
		itemsLogged.push(new NavigationBarItem('Logout', null, this.logout.bind(this)));
		itemsLogged.push(new NavigationBarItem('Administradores', '/admin', null));
		itemsLogged.push(new NavigationBarItem('Jogadores', '/players', null));
		itemsLogged.push(new NavigationBarItem('Adicionar Jogo', '/insert-match', this.createMatch.bind(this)));
		itemsLogged.push(new NavigationBarItem('Hall of fame', '/hall', null));
		itemsLogged.push(new NavigationBarItem('Temporada', '/season/standings/current', null));
		itemsLogged.push(new NavigationBarItem('Criar Nova Temporada', null, this.createSeason.bind(this)));
		itemsLogged.push(new NavigationBarItem('Escolher times', '/team-pick', this.teamPick.bind(this)));
		return itemsLogged;
	}

	reverseArray(array) {
		var newArray = [];
		for (var i = array.length - 1; i >= 0; i--) {
			newArray.push(array[i]);
		}
		return newArray;
	}

	ngOnInit() {
		$(".button-collapse").sideNav({
			closeOnClick: true
		});
	}

	openMatchModal() {
		this.matchModalActions.emit({action:"modal", params:['open']});
	}

	createMatch() {
		var currentChamp = this.championshipService.getSelectedChampionship();
		if (currentChamp) {
			this.matchService.getFinalFromChampionship(currentChamp._id).toPromise()
				.then(response => {
					if (response.length > 0) {
						window.alert("Não é possível cadastrar um jogo pois este mês já tem uma final cadastrada.");
						return;
					}	else {
						this.openMatchModal();
					}
				})
		} else {
			if (!window.confirm("Este mês ainda não tem um campeonato criado. Deseja criar?")) {
				return;
			} else if (this.createSeason()) {
					this.openMatchModal();
			}
		}
	}

	teamPick() {
		this.teamPickModalActions.emit({action:"modal", params:['open']});
	}

	closeTeamPickModal(result) {
		this.teamPickModalActions.emit({action:"modal", params:['close']});
	}

	closeMatchModal(result) {
		this.matchModalActions.emit({action:"modal", params:['close']});
		this.onCreateMatchSuccess.emit(result);
	}

	onLoginChange() {
		this.isLoggedIn = this.loginService.isLoggedIn();
		if (this.isLoggedIn) {
			this.items = this.getItemsLogged();
		} else {
			this.items = this.getItemsNotLogged();
		}
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
		if (this.championshipService.getCurrentChampionship()) {
			this.createSeasonBasedOnCurrentSeason(this.championshipService.getCurrentChampionship());
			return true;
		}

		this.championshipService.getCurrent().subscribe((current: Championship[]) => {
			if (current.length == 0) {
				var date = new Date();
				this.insertChampionship(date.getMonth() + 1, date.getFullYear());
				return true;
			}
			var currentSeason = current[0];
			this.createSeasonBasedOnCurrentSeason(currentSeason);
			return true;
		}, (error: any) => {
			console.error(error);
			return false;
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
