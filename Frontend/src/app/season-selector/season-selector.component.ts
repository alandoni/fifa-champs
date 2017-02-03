import { Component, OnInit } from '@angular/core';
import { MatchService } from './../match.service';

@Component({
	selector: 'app-season-selector',
	templateUrl: './season-selector.component.html',
	styleUrls: ['./season-selector.component.css']
})
export class SeasonSelectorComponent implements OnInit {

	players;
	matches;
	date = new Date();
	isLoading;

	constructor(private matchService: MatchService) {
		
	}

	getCurrentMonth() {
		const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
		return months[this.date.getMonth()] + " de " + this.date.getFullYear();
	}

	previousMonth() {
		this.date = this.sumMonth(this.date, -1)
		this.requestMatches();
	}

	nextMonth() {
		this.date = this.sumMonth(this.date, 1)
		this.requestMatches();
	}

	sumMonth(date, numberOfMonths) {
		var newDate = new Date(date);
		newDate.setMonth(date.getMonth() + numberOfMonths);
		return newDate;
	}

	requestMatches() {
		console.log("Requesting matches");
		this.isLoading = true;
		this.matchService.getAll().subscribe((matches) => {
			console.log("Requested matches");
			this.matches = matches;
			this.getPlayersFromMatches();
			this.isLoading = false;
		}, (error) => console.log(error));
	}

	getPlayersFromMatches() {
		this.players = [];
		for (var match in this.matches) {
			if (this.players.indexOf(this.matches[match].player1) < 0) {
				this.players.push(this.matches[match].player1);
			}
			if (this.players.indexOf(this.matches[match].player2) < 0) {
				this.players.push(this.matches[match].player2);
			}
			if (this.players.indexOf(this.matches[match].player3) < 0) {
				this.players.push(this.matches[match].player3);
			}
			if (this.players.indexOf(this.matches[match].player4) < 0) {
				this.players.push(this.matches[match].player4);
			}
		}
	}

	formatDate(date) {
		return (date.getDate() < 9 ? "0" : "") + date.getDate() + "/" + (date.getMonth() < 9 ? "0" : "") + (date.getMonth() + 1) + "/" + date.getFullYear();
	}

	ngOnInit() {
		this.requestMatches();
	}

}
