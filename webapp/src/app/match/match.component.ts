import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Match } from './../models/match';
import { LoginService } from './../login.service';
import { MatchService } from './../match.service';
import { MaterializeAction } from 'angular2-materialize';

@Component({
    selector : 'app-match',
    templateUrl : './match.component.html',
    styleUrls : ['./match.component.css']
})
export class MatchComponent implements OnInit {

    matchModalActions = new EventEmitter<string|MaterializeAction>();
    @Output() onEditMatch = new EventEmitter<Match>();
    @Input() match : Match;
    hasPenalties : boolean;
    isLoggedIn : boolean;
    isDeleted : boolean;

    constructor(private loginService : LoginService, private matchService : MatchService) { }

    ngOnInit() {
        this.hasPenalties = this.match.isFinal && (this.match.team1penalties > 0 || this.match.team2penalties);
        this.loginService.addListener(this);
        this.onLoginChange();
    }

    onLoginChange() {
        this.isLoggedIn = this.loginService.isLoggedIn();
    }

    getWinnerTeamIndex() {
        if (this.match.team1score > this.match.team2score) {
            return 1;
        }
        if (this.match.team1score < this.match.team2score) {
            return 2;
        }
        if (this.match.isFinal) {
            if (this.match.team1penalties > this.match.team2penalties) {
                return 1;
            }
            if (this.match.team1penalties < this.match.team2penalties) {
                return 2;
            }
        }
        return 0;
    }

    editGame(event) {
        event.preventDefault();
        this.onEditMatch.emit(this.match);
    }

    delete(event) {
        event.preventDefault();
        const p1 = this.match.player1.nickname;
        const p2 = this.match.player2.nickname;
        const p3 = this.match.player3.nickname;
        const p4 = this.match.player4.nickname;
        const s1 = this.match.team1score;
        const s2 = this.match.team2score;

        const matchString = p1 + ' / ' + p2 + ' ' + s1 + ' x ' + s2 + ' ' + p3 + ' / ' + p4;

        if (!confirm('Excluir este jogo?\n' + matchString)) {
            return;
        }

        this.matchService.delete(this.match._id).subscribe((result) => {
            this.isDeleted = true;
        },
        (error) => console.log(error));
    }
}
