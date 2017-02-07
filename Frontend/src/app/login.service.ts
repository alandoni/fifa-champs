import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Md5 } from 'ts-md5/dist/md5';
import { Player } from './models/Player';
import { ApiRequestService } from './api-request.service';

@Injectable()
export class LoginService {

	private url = '/login';
	private isLogged;
	private listeners = [];

	constructor(private api: ApiRequestService) { }

	login(nickname, password) : Observable<Player> {
		var passwordHash = Md5.hashStr(password);
		var result = this.api.post(this.url, {nickname: nickname, password: passwordHash});
		result.subscribe((result) => {
			this.isLogged = true;
			for (var listener in this.listeners) {
				if (this.listeners[listener]) {
					this.listeners[listener].onLoginChange();
				}
			}
		}, (error) => this.isLogged = false);
		return result;
	}

	public isLoggedIn() {
		return this.isLogged;
	}

	public addListener(listener) {
		this.listeners.push(listener);
	}

	public logout() {
		console.log("Logging out");
		var result = this.api.post('/logout', {});
		result.subscribe((result) => {
			this.isLogged = false;

			for (var listener in this.listeners) {
				if (this.listeners[listener]) {
					this.listeners[listener].onLoginChange();
				}
			}
		});
		return result;
	}
}
