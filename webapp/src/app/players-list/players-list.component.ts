import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerService } from './../player.service';
import { LoginService } from './../login.service';
import { Player } from './../models/player';
import { MaterializeAction } from 'angular2-materialize';

@Component({
    selector : 'app-players-list',
    templateUrl : './players-list.component.html',
    styleUrls : ['./players-list.component.css']
})
export class PlayersListComponent implements OnInit {

    modalActions = new EventEmitter<string|MaterializeAction>();
    players : Player[];
    selectedPlayer : Player;
    selectedIndex : number;

    constructor(private router : Router, private playerService : PlayerService, private loginService : LoginService) { }

    ngOnInit() {
        if (!this.loginService.isLoggedIn()) {
            this.router.navigateByUrl('/');
            return;
        }

        this.playerService.getAll().subscribe((players : Player[]) => {
            this.players = players;
        },
        (error) => console.log(error));
    }

    updateUser(event, index) {
        event.preventDefault();
        this.selectedPlayer = this.players[index];
        this.selectedIndex = index;
        this.openModal();
    }

    deleteUser(event, index) {
        event.preventDefault();
        this.selectedIndex = index;
        if (window.confirm('Tem certeza que quer excluir o ' + this.players[index].nickname + '?')) {
            this.playerService.delete(this.players[index]._id).subscribe((result) => {
                this.players = this.players.filter((el) => {
                    return el._id !== this.players[this.selectedIndex]._id;
                });
                console.log(this.selectedIndex);
            },
            (error) => console.log(error));
        }
    }

    addUser() {
        this.selectedPlayer = null;
        this.selectedIndex = -1;
        this.openModal();
    }

    openModal() {
        this.modalActions.emit({action : 'modal', params : ['open']});
    }

    closeModal(result) {
        if (this.selectedIndex === -1) {
            this.players.push(result);
        } else {
            this.players[this.selectedIndex] = result;
        }
        this.modalActions.emit({action : 'modal', params : ['close']});
    }

    public get hasPlayers() {
        return this.players != null && this.players.length > 0;
    }
}
