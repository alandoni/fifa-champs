import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LoginService } from './../login.service';
import { Player } from './../models/player';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    @Output() onLoginSuccess : EventEmitter<Player> = new EventEmitter();

    nickname = '';
    password = '';
    error = null;

    constructor(private login : LoginService) { }

    tryLogin() {
        this.login.getSalt(this.nickname).subscribe((salt) => {
            this.login.login(this.nickname, this.password, salt.salt).subscribe(
                (result) => this.loginSuccess(result),
                (error : any) => {
                    console.log(error);
                    this.error = error;
                }
            );
        });
    }

    loginSuccess(result : Player) {
        this.onLoginSuccess.emit(result);
    }

    ngOnInit() { }
}
