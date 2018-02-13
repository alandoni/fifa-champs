import { Component, OnInit, Output, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { LoginService } from './../login.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-create-admin',
    templateUrl: './create-admin.component.html',
    styleUrls: ['./create-admin.component.css']
})
export class CreateAdminComponent implements OnInit {

    @Output() onCreateAdminSuccess : EventEmitter<any> = new EventEmitter();
    @Input() admin : any;

    nickname = '';
    password = '';
    id = null;
    salt = null;
    error = null;
    isUpdatingByUrl = false;

    constructor(private loginService : LoginService, private route : ActivatedRoute, private router : Router) { }

    ngOnInit() {
        this.route.params.subscribe(params => {

            if (params['id']) {
                this.id = params['id'];
            }

            if (params['nickname']) {
                this.nickname = params['nickname'];
                this.isUpdatingByUrl = true;
            }

            if (params['salt']) {
                this.salt = params['salt'];
            }
        });
    }

    tryCreateAdmin() {
        if (this.admin || this.isUpdatingByUrl) {
            this.tryUpdateAdmin();
            return;
        }

        this.loginService.insert(this.nickname).subscribe((result) => {
            this.adminCreatedSuccess(result);
        }, (error) => {
            console.log(<any>error);
            this.error = <any>error;
        });
    }

    tryUpdateAdmin() {
        let salt = null;
        let password = null;
        if (this.salt) {
            salt = this.salt;
            password = this.password;
        }
        this.loginService.update(this.id, this.nickname, password, salt).subscribe((result) => {
            this.adminCreatedSuccess(result);
        }, (error) => {
            console.log(<any>error);
            this.error = <any>error;
        });
    }

    adminCreatedSuccess(result : any) {
        if (this.isUpdatingByUrl) {
            document.location.href = '/';
            return;
        }
        console.log('Admin created ' + result.nickname);
        this.onCreateAdminSuccess.emit(result);
        this.nickname = '';
    }

    ngOnChanges(changes : SimpleChanges) {
        const admin = changes['admin'].currentValue;

        if (admin) {
            this.nickname = admin.nickname;
            this.id = admin._id;
        } else {
            this.nickname = '';
            this.id = null;
        }

        if (admin) {
            if (admin && this.loginService.user.nickname === admin.nickname) {
                this.loginService.getSalt(admin.nickname).subscribe((salt) => {
                    this.salt = salt.salt;
                });
            } else {
                this.salt = null;
            }
        }
    }
}
