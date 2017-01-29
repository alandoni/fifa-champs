import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Md5 } from 'ts-md5/dist/md5';
import { Player } from './models/Player';

@Injectable()
export class LoginService {

	private url = 'http://localhost:5001/login';
	private playersUrl = 'http://localhost:5001/players';

	constructor(private http: Http) { }

	login(nickname, password) : Observable<Player> {
	  var passwordHash = Md5.hashStr(password);
		return this.http.post(this.url, {nickname: nickname, password: passwordHash}).map((response) => { 
			return response.json();
		}).catch((error: Response | any) => {
			console.log(error);
			return Observable.throw(error.json());
		});
	}
}
