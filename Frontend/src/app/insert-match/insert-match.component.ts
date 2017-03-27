import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatchService } from './../match.service';
import { Match } from './../models/match';
import { Player } from './../models/player';
import { PlayerDropdownSelected } from './../models/PlayerDropdownSelected';
import { ChampionshipService } from './../championship.service';
import { PlayerService } from './../player.service';

@Component({
  selector: 'app-insert-match',
  templateUrl: './insert-match.component.html',
  styleUrls: ['./insert-match.component.css']
})
export class InsertMatchComponent implements OnInit {

  @Output() onCreateMatchSuccess: EventEmitter<Match> = new EventEmitter();
  match: Match = new Match();
  error: any;
  selected: false;
  players: Array<Player>;
  minDate: Date;
  maxDate: Date;

  constructor(private playerService: PlayerService, private matchService: MatchService,
              private championshipService: ChampionshipService) {  }

  tryCreateMatch() {
    if (!this.championshipService.getCurrentChampionship()) {
      this.error = {description: 'Verifique se há um campeonato criado.'};
      return;
    }
    if (this.verifyRepeatedPlayer()) {
      this.error = {description: 'Verifique se há jogadores repetidos.'};
      return;
    }
    if (this.match.team1score == null || this.match.team1score === undefined) {
      this.error = {description: 'Verifique a pontuação dos times.'};
      return;
    }
    if (this.match.team2score == null || this.match.team2score === undefined) {
      this.error = {description: 'Verifique a pontuação dos times.'};
      return;
    }

    this.match.championship = this.championshipService.getCurrentChampionship();
    this.match.isFinal = this.selected;
    this.matchService.insert(this.match).subscribe(
      (result) => this.matchCreatedSuccess(result),
      (error : any) => {
        console.log(error);
        this.error = error;
      }
    );
  }

  verifyRepeatedPlayer() {
    if (this.match.player1 === this.match.player2) {
      return true;
    }
    if (this.match.player1 === this.match.player3) {
      return true;
    }
    if (this.match.player1 === this.match.player4) {
      return true;
    }
    if (this.match.player2 === this.match.player3) {
      return true;
    }
    if (this.match.player2 === this.match.player4) {
      return true;
    }
    if (this.match.player3 === this.match.player4) {
      return true;
    }
    return false;
  }

  matchCreatedSuccess(result: Match) {
    if (document.location.href.indexOf('insert-match') > 0) {
      document.location.href = '/';
      return;
    }
    this.ngOnInit();
    this.onCreateMatchSuccess.emit(result);
  }

  handlePlayerSelection(playerSelection: PlayerDropdownSelected){
    this.match[playerSelection.inputName] = playerSelection.selectedValue;
  }

  ngOnInit() {
    let dateNow = new Date();
    this.match = {_id: undefined, player1: undefined, player2: undefined, player3: undefined, player4: undefined,
      team1score: undefined, team2score: undefined, isFinal: false, championship: undefined, date: dateNow};
    this.error = null;
    this.selected = false;

    this.minDate = new Date(dateNow.getFullYear(),dateNow.getMonth(),1);
    this.maxDate = new Date(dateNow.getFullYear(),dateNow.getMonth() +1,0);

    this.requestAllPlayers();

    this.playerService.addListener(this);
    console.log('Insert-match now will listen any players changes');
  }

  onPlayersChanged() {
    this.requestAllPlayers();
  }

  requestAllPlayers() {
    this.playerService.getAll().subscribe(
      (result) => {
        console.log('Just updated players');
        this.players = result;
      },
      (error: any) => {
        console.log(error);
        this.error = error;
      }
    );
  }
}
