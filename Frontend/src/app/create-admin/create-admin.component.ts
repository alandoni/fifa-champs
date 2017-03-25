import { Component, OnInit, Output, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { LoginService } from './../login.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-admin',
  templateUrl: './create-admin.component.html',
  styleUrls: ['./create-admin.component.css']
})
export class CreateAdminComponent implements OnInit {

  @Output() onCreateAdminSuccess: EventEmitter<any> = new EventEmitter();
	@Input() admin: any;

	nickname = '';
  password = '';
	id = null;
  salt = null;
	error = null;
	isUpdatingByUrl = false;

	constructor(private loginService: LoginService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
		this.route.params.subscribe(params => {
			console.log('Getting new data');

			if (params['id']) {
				this.id = params['id'];
			}

			if (params['nickname']) {
				this.nickname = params['nickname'];
				console.log(this.nickname);
				this.isUpdatingByUrl = true;
			}

      if (params['salt']) {
        this.salt = params['salt'];
				console.log(this.salt);
      }
    });
  }

	tryCreateAdmin() {
		if (this.admin || this.isUpdatingByUrl) {
			this.tryUpdateAdmin();
			return;
		}

		this.loginService.insert(this.nickname).subscribe(
			(result) => this.adminCreatedSuccess(result),
			(error) => {
				console.log(<any>error);
				this.error = <any>error;
			}
		);
	}

	tryUpdateAdmin() {
		var salt = undefined;
		var password = undefined;
		if (this.salt) {
			salt = this.salt;
			password = this.password;
		}
		this.loginService.update(this.id, this.nickname, password, salt).subscribe(
			(result) => this.adminCreatedSuccess(result),
			(error) => {
				console.log(<any>error);
				this.error = <any>error;
			}
		);
	}

	adminCreatedSuccess(result: any) {
		if (this.isUpdatingByUrl) {
			document.location.href = '/';
			return;
		}
		console.log('Admin created ' + result.nickname);
		this.onCreateAdminSuccess.emit(result);
		this.nickname = '';
	}

	ngOnChanges(changes: SimpleChanges) {
		var admin = changes['admin'].currentValue;

		if (admin) {
			console.log(admin.nickname);
			this.nickname = admin.nickname;
			this.id = admin._id;
		} else {
			console.log(admin);
			this.nickname = '';
			this.id = null;
		}

		if (admin) {
			console.log(this.loginService.user.nickname);
			if (admin && this.loginService.user.nickname === admin.nickname) {
				this.loginService.getSalt(admin.nickname).subscribe((salt) => {
					this.salt = salt.salt;
				});
			} else {
				console.log('cancel salt');
				this.salt = null;
			}
		}
	}
}
