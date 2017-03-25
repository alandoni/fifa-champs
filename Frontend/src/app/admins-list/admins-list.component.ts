import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './../login.service';
import { MaterializeAction } from 'angular2-materialize';

@Component({
	selector: 'app-admins-list',
	templateUrl: './admins-list.component.html',
	styleUrls: ['./admins-list.component.css']
})
export class AdminsListComponent implements OnInit {

	modalActions = new EventEmitter<string|MaterializeAction>();
	admins: Array<any>;
	selectedAdmin: any;
	selectedIndex: number;
  url: String = null;

	constructor(private router: Router, private loginService: LoginService) { }

	ngOnInit() {
		if (!this.loginService.isLoggedIn()) {
      console.log('Not logged, redirecting');
			this.router.navigateByUrl('/');
			return;
		}

		this.loginService.getAll().subscribe(
			(admins: Array<any>) => {
				this.admins = admins;
			},
			(error) => console.log(error)
		);
	}

	updateUser(event, index) {
		event.preventDefault();
		this.selectedAdmin = this.admins[index];
    console.log('Updating user ' + this.admins[index].nickname);
		this.selectedIndex = index;
		this.openModal();
	}

	deleteUser(event, index) {
		event.preventDefault();
		this.selectedIndex = index;
		if (window.confirm('Tem certeza que quer excluir o ' + this.admins[index].nickname + '?')) {
			this.loginService.delete(this.admins[index]._id).subscribe(
				(result) => {
					console.log(result);
					this.admins = this.admins.filter((el) => {
					    return el._id !== this.admins[this.selectedIndex]._id;
					});
					console.log(this.selectedIndex);
				},
				(error) => console.log(error)
			);
		}
	}

	addUser() {
		this.selectedAdmin = null;
		this.selectedIndex = -1;
		this.openModal();
	}

	openModal() {
		this.modalActions.emit({action:'modal', params:['open']});
	}

	closeModal(result) {
		if (this.selectedIndex == -1) {
			this.admins.push(result);
		} else {
			this.admins[this.selectedIndex] = result;
		}
		this.modalActions.emit({action:'modal', params:['close']});
    this.loginService.getSalt(result.nickname).subscribe((salt) => {
      this.url = window.location.host + '/admin/create/' + result._id + '/' + result.nickname + '/' + salt.salt;
    });
	}

	private get hasAdmins() {
		return this.admins != null && this.admins.length > 0;
	}
}
