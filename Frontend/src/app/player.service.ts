import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Player } from './models/player';
import { ApiRequestService } from './api-request.service';

@Injectable()
export class PlayerService {

	private url = '/players';
	private listeners = [];
	private players = [];

	constructor(private api: ApiRequestService) { }

	insert(nickname) : Observable<Player> {
		console.log("inserting player " + nickname);
		var result = this.api.post(this.url, {nickname: nickname});
		result.subscribe((res) => {
			console.log("Notifying listeners");
			this.players.push(res);
			for (var listener in this.listeners) {
				if (this.listeners[listener]) {
					this.listeners[listener].onPlayersChanged();
				}
			}
		});
		return result;
	}

	update(id, nickname, pictureUrl) : Observable<Player> {
		var result = this.api.post(this.url + '/' + id, {nickname: nickname, picture: pictureUrl});
		result.subscribe((res) => {

			for (let i = 0; i < this.players.length; i++) {
				if (this.players[i]._id === res._id) {
					this.players[i] = res;
					break;
				}
			}

			for (var listener in this.listeners) {
				if (this.listeners[listener]) {
					this.listeners[listener].onPlayersChanged();
				}
			}
		});
		return result;
	}

	delete(id) : Observable<Player> {
		var result = this.api.delete(this.url + '/' + id);
		result.subscribe((res) => {

			this.players = this.players.filter((el) => {
				return el._id !== res._id;
			});

			for (var listener in this.listeners) {
				if (this.listeners[listener]) {
					this.listeners[listener].onPlayersChanged();
				}
			}
		});
		return result;
	}

	public addListener(listener) {
		this.listeners.push(listener);
	}

	getAll() : Observable<Player[]> {
		var result = this.api.get(this.url);
		result.subscribe((res) => {
			this.players = res;
			for (var listener in this.listeners) {
				if (this.listeners[listener]) {
					this.listeners[listener].onPlayersChanged();
				}
			}
		});
		return result;
	}

	getPlayers() {
		return this.players;
	}
}
