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
  isFinal: false;
  players: Array<Player>;
  minDate: Date;
  maxDate: Date;

  constructor(private playerService: PlayerService, private matchService: MatchService,
              private championshipService: ChampionshipService) {  }

  tryCreateMatch() {
    this.match.isFinal = this.isFinal;

    if (!this.championshipService.getCurrentChampionship()) {
      this.error = {description: 'Verifique se há um campeonato criado.'};
      return;
    }
    if (this.verifyRepeatedPlayer()) {
      this.error = {description: 'Verifique se há jogadores repetidos.'};
      return;
    }
    if (this.match.team1score == null || this.match.team1score === undefined || this.match.team1score.length === 0) {
      this.error = {description: 'Verifique a pontuação dos times.'};
      return;
    }
    if (this.match.team2score == null || this.match.team2score === undefined || this.match.team1score.length === 0) {
      this.error = {description: 'Verifique a pontuação dos times.'};
      return;
    }

    const isTieAndFinal: boolean = this.match.team1score === this.match.team2score && this.match.isFinal;

    if (isTieAndFinal &&
        (this.match.team1penalties == null || this.match.team1penalties === undefined || this.match.team1penalties.length === 0)) {
      this.error = {description: 'Verifique os pênaltis dos times.'};
      return;
    }

    if (isTieAndFinal &&
        (this.match.team2penalties == null || this.match.team2penalties === undefined || this.match.team2penalties.length === 0)) {
      this.error = {description: 'Verifique os pênaltis dos times.'};
      return;
    }

    if (isTieAndFinal && (this.match.team1penalties === this.match.team2penalties)) {
      this.error = {description: 'Verifique os pênaltis dos times.'};
      return;
    }

    // TODO: get championship of month:
    this.match.championship = this.championshipService.getCurrentChampionship();
    console.log(this.match);

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
    this.match = new Match();
    this.error = null;
    this.isFinal = false;

    this.minDate = new Date(dateNow.getFullYear(), dateNow.getMonth(), 1);
    this.maxDate = new Date(dateNow.getFullYear(), dateNow.getMonth() + 1, 0);

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
