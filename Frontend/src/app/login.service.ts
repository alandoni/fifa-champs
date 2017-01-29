import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Md5 } from 'ts-md5/dist/md5';
import { Player } from './models/Player';
import { ApiRequestService } from './api-request.service';

@Injectable()
export class LoginService {

	private url = '/login';
	private isLogged;

	constructor(private api: ApiRequestService) { }

	login(nickname, password) : Observable<Player> {
		var passwordHash = Md5.hashStr(password);
		var result = this.api.post(this.url, {nickname: nickname, password: passwordHash});
		result.subscribe((result) => this.isLogged = true, (error) => this.isLogged = false);
		return result;
	}

	public isLoggedIn() {
		return this.isLogged;
	}
}
