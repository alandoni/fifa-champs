import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LoginService } from "./../login.service";
import { Player } from './../models/Player';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	@Output() onLoginSuccess: EventEmitter<Player> = new EventEmitter();

	nickname = "";
	password = "";
	error = null;

	constructor(private login: LoginService) { }

	tryLogin() { 
		this.login.login(this.nickname, this.password).subscribe(
			(result) => this.loginSuccess(result),
			(error) => {
				console.log(error);
				this.error = error;
			}
		);
	}

	loginSuccess(result: Player) {
		this.onLoginSuccess.emit(result);
	}

	ngOnInit() { }
}
