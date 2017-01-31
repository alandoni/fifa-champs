import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-season',
	templateUrl: './season.component.html',
	styleUrls: ['./season.component.css']
})
export class SeasonComponent implements OnInit {

	matches;
	players;

	constructor() { 
		this._mockPlayers();
		this._mockMatches();
	}

	_mockPlayers() {
		this.players = [];
		this.players.push({nickname: 'alan'});
		this.players.push({nickname: 'chris'});
		this.players.push({nickname: 'lauro'});
		this.players.push({nickname: 'rborcat'});
		this.players.push({nickname: 'junim'});
		this.players.push({nickname: 'joao'});
	}

	_mockMatches() {
		this.matches = [];
		this.matches.push({
			player1: this.players[0], 
			player2: this.players[1], 
			player3: this.players[2], 
			player4: this.players[3], 
			team1score: 3, 
			team2score: 1,
			date: this.formatDate(new Date())
		});
		this.matches.push({
			player1: this.players[1], 
			player2: this.players[3], 
			player3: this.players[2], 
			player4: this.players[4], 
			team1score: 1, 
			team2score: 3,
			date: this.formatDate(new Date())
		});

		var date = new Date();
		date.setDate(date.getDate()+1)
		this.matches.push({
			player1: this.players[2], 
			player2: this.players[0], 
			player3: this.players[3], 
			player4: this.players[5], 
			team1score: 4, 
			team2score: 0,
			date: this.formatDate(date)
		});
	}

	formatDate(date) {
		return (date.getDate() < 9 ? "0" : "") + date.getDate() + "/" + (date.getMonth() < 9 ? "0" : "") + (date.getMonth() + 1) + "/" + date.getFullYear();
	}

	ngOnInit() {
	}

}
