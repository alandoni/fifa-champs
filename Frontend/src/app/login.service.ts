import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Md5 } from 'ts-md5/dist/md5';
import { ApiRequestService } from './api-request.service';

@Injectable()
export class LoginService {

	private url = '/login';
	private url_salt = '/salt';
	private url_admin = '/admin';
	private isLogged;
	private listeners = [];
	user : any;

	constructor(private api: ApiRequestService) { }

	public login(nickname, password, salt) : Observable<any> {
		var passwordHash = this.getPasswordHash(password, salt);
		console.log(passwordHash);
		var result = this.api.post(this.url, {nickname: nickname, password: passwordHash});
		result.subscribe((res) => {
			this.isLogged = true;
			this.user = res;
			for (var listener in this.listeners) {
				if (this.listeners[listener]) {
					this.listeners[listener].onLoginChange();
				}
			}
			console.log('Logged: ' + res);
			
		}, (error) => this.isLogged = false);
		return result;
	}

	private getPasswordHash(password, salt) {
		 return Md5.hashStr(Md5.hashStr(salt) + '' + Md5.hashStr(password));
	}

	public isLoggedIn() {
		return this.isLogged;
	}

	public addListener(listener) {
		this.listeners.push(listener);
	}

	public logout() : Observable<any>  {
		console.log("Logging out");
		var result = this.api.post('/logout', {});
		result.subscribe((result) => {
			this.isLogged = false;
			this.user = null;
			for (var listener in this.listeners) {
				if (this.listeners[listener]) {
					this.listeners[listener].onLoginChange();
				}
			}
		});
		return result;
	}

	public getSalt(nickname) : Observable<any> {
		return this.api.get(this.url_salt + '/' + nickname);
	}

	public insert(nickname) : Observable<any> {
		return this.api.post(this.url_admin, {nickname: nickname});
	}

	public update(id, nickname, password = undefined, salt = undefined) : Observable<any> {
		if (password && salt) {
			password = this.getPasswordHash(password, salt);
		}
		console.log(password);
		return this.api.post(this.url_admin + '/' + id, {nickname: nickname, password: password});
	}

	public getAll() : Observable<any> {
		return this.api.get(this.url_admin);
	}

	public delete(id) : Observable<any> {
		return this.api.delete(this.url_admin + '/' + id);
	}
}
