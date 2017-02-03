import { Component, OnInit, EventEmitter } from '@angular/core';
import { LoginService } from './../login.service';
import { MaterializeAction } from 'angular2-materialize';

@Component({
	selector: 'app-navigation-bar',
	templateUrl: './navigation-bar.component.html',
	styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {

	modalActions = new EventEmitter<string|MaterializeAction>();
	isLoggedIn;

	constructor(private loginService : LoginService) {
		this.isLoggedIn = loginService.isLoggedIn();
		this.loginService.addListener(this);
	}

	ngOnInit() {

	}

	createMatch() {

	}

	onLoginChange() {
		this.isLoggedIn = this.loginService.isLoggedIn();
	}

	logout() {
		this.loginService.logout();
	}

	openLoginModal() {
		this.modalActions.emit({action:"modal", params:['open']});
	}

	closeLoginModal(result) {
		this.modalActions.emit({action:"modal", params:['close']});
	}
}
