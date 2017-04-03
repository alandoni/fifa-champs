import { Component, OnInit, OnChanges, Output, Input, EventEmitter } from '@angular/core';
import { MatchService } from './../match.service';
import { Match } from './../models/match';
import { Player } from './../models/player';
import { ChampionshipService } from './../championship.service';
import { PlayerService } from './../player.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'app-insert-match',
	templateUrl: './insert-match.component.html',
	styleUrls: ['./insert-match.component.css']
})
export class InsertMatchComponent implements OnInit, OnChanges {

	@Output() onCreateMatchSuccess: EventEmitter<Match> = new EventEmitter();
	@Input() match: Match;

	matchDateOptions: any;
	isEditingMatch = false;
	error: any;
	isFinal: false;
	players: Array<Player>;

	constructor(private playerService: PlayerService, private matchService: MatchService,
				private championshipService: ChampionshipService,  private router: Router,
				private route: ActivatedRoute) {
		this.playerService.getAll();
		this.playerService.addListener(this);
	}

	requestMatch(id) {
		this.isEditingMatch = true;
		this.matchService.getById(id).subscribe((result) => {
			this.match = result;
		}, (error) => {
			console.error(error);
			this.error = error;
		});
	}

	onPlayersChanged() {
		this.players = this.playerService.getPlayers();
		if (!this.isEditingMatch) {
			if (!this.match) {
				this.match = new Match();
			}
			this.match.player1 = this.players[0];
			this.match.player2 = this.players[0];
			this.match.player3 = this.players[0];
			this.match.player4 = this.players[0];
		}
	}

	handlePlayerChange(event) {
		this.match[event.target] = event.player;
	}

	validate(): boolean {
		if (!this.championshipService.getCurrentChampionship()) {
			this.error = {description: 'Verifique se há um campeonato criado.'};
			return false;
		}
		if (this.verifyRepeatedPlayer()) {
			this.error = {description: 'Verifique se há jogadores repetidos.'};
			return false;
		}
		if (this.match.team1score == null || this.match.team1score === undefined || this.match.team1score.length === 0) {
			this.error = {description: 'Verifique a pontuação dos times.'};
			return false;
		}
		if (this.match.team2score == null || this.match.team2score === undefined || this.match.team1score.length === 0) {
			this.error = {description: 'Verifique a pontuação dos times.'};
			return false;
		}

		const isTieAndFinal: boolean = this.match.team1score === this.match.team2score && this.match.isFinal;

		if (isTieAndFinal &&
				(this.match.team1penalties == null || this.match.team1penalties === undefined || this.match.team1penalties.length === 0)) {
			this.error = {description: 'Verifique os pênaltis dos times.'};
			return false;
		}

		if (isTieAndFinal &&
				(this.match.team2penalties == null || this.match.team2penalties === undefined || this.match.team2penalties.length === 0)) {
			this.error = {description: 'Verifique os pênaltis dos times.'};
			return false;
		}

		if (isTieAndFinal && (this.match.team1penalties === this.match.team2penalties)) {
			this.error = {description: 'Verifique os pênaltis dos times.'};
			return false;
		}
		return true;
	}

	tryCreateMatch() {
		this.match.isFinal = this.isFinal;

		if (!this.validate()) {
			return;
		}

		// TODO: get championship of month:
		this.match.championship = this.championshipService.getCurrentChampionship();

		let request = null;
		if (this.isEditingMatch) {
			request = this.matchService.update(this.match._id, this.match);
		} else {
			request = this.matchService.insert(this.match);
		}

		request.subscribe(
			(result) => this.matchCreatedSuccess(result),
			(error: any) => {
				console.log(error);
				this.error = error;
			}
		);
	}

	verifyRepeatedPlayer() {
		if (this.match.player1._id === this.match.player2._id) {
			return true;
		}
		if (this.match.player1._id === this.match.player3._id) {
			return true;
		}
		if (this.match.player1._id === this.match.player4._id) {
			return true;
		}
		if (this.match.player2._id === this.match.player3._id) {
			return true;
		}
		if (this.match.player2._id === this.match.player4._id) {
			return true;
		}
		if (this.match.player3._id === this.match.player4._id) {
			return true;
		}
		return false;
	}

	matchCreatedSuccess(result: Match) {
		if (document.location.href.indexOf('match') > 0) {
			this.router.navigate(['/']);
			return;
		}
		this.ngOnChanges();
		this.onCreateMatchSuccess.emit(result);
	}

	ngOnInit() {

	}

	ngOnChanges(changes: SimpleChanges) {
		const url = window.location.href;
		this.isEditingMatch = url.indexOf('match') > 0 && url.indexOf('insert') < 0;
		this.route.params.subscribe(params => {
			if (params['id'] && this.isEditingMatch) {
				this.requestMatch(params['id']);
			}
		});
		if (!this.match && !this.isEditingMatch) {
			this.isEditingMatch = false;
			this.match = new Match();
		} else {
			this.isEditingMatch = true;
		}

		this.matchDateOptions = this.getDefaultPickerOptions();

		this.error = null;
		this.isFinal = false;
	}

	private getDefaultPickerOptions() {
		return {
			monthsFull: [ 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
				'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro' ],
			monthsShort: [ 'jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez' ],
			weekdaysFull: [ 'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado' ],
			weekdaysShort: [ 'dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab' ],
			today: 'Hoje',
			clear: 'Limpar',
			close: 'Fechar',
			max: new Date(),
			format: 'yyyy-mm-dd'
		};
	}
}
