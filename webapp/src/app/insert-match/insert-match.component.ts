import { Component, OnInit, OnChanges, Output, Input, EventEmitter, SimpleChanges } from '@angular/core';
import { MatchService } from './../match.service';
import { Match } from './../models/match';
import { Player } from './../models/player';
import { ChampionshipService } from './../championship.service';
import { PlayerService } from './../player.service';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';

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
	hasFinal: boolean = false;
	players: Array<Player>;

	constructor(private playerService: PlayerService, private matchService: MatchService,
		private championshipService: ChampionshipService, private router: Router,
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
		if (this.hasFinal && this.match.isFinal) {
			this.error = { description: 'Já existe uma final nesse campeonato.' };
			return false;
		}

		if (this.verifyRepeatedPlayer()) {
			this.error = { description: 'Verifique se há jogadores repetidos.' };
			return false;
		}
		if (this.match.team1score == null || this.match.team1score === undefined || this.match.team1score.length === 0) {
			this.error = { description: 'Verifique a pontuação dos times.' };
			return false;
		}
		if (this.match.team2score == null || this.match.team2score === undefined || this.match.team1score.length === 0) {
			this.error = { description: 'Verifique a pontuação dos times.' };
			return false;
		}

		const isTieAndFinal: boolean = this.match.team1score === this.match.team2score && this.match.isFinal;

		if (isTieAndFinal &&
			(this.match.team1penalties == null || this.match.team1penalties === undefined || this.match.team1penalties.length === 0)) {
			this.error = { description: 'Verifique os pênaltis dos times.' };
			return false;
		}

		if (isTieAndFinal &&
			(this.match.team2penalties == null || this.match.team2penalties === undefined || this.match.team2penalties.length === 0)) {
			this.error = { description: 'Verifique os pênaltis dos times.' };
			return false;
		}

		if (isTieAndFinal && (this.match.team1penalties === this.match.team2penalties)) {
			this.error = { description: 'Verifique os pênaltis dos times.' };
			return false;
		}
		return true;
	}

	tryCreateMatch() {
		this.match.isFinal = this.isFinal;

		if (!this.championshipService.getSelectedChampionship()) {
			this.error = { description: 'Verifique se há um campeonato criado neste mês.' };
			return false;
		}

		this.match.championship = this.championshipService.getSelectedChampionship();

		this.matchService.getFinalFromChampionship(this.match.championship._id).toPromise()
			.then(response => {
				if(response.length > 0)
					this.hasFinal = true;
				else
					this.hasFinal = false;
					
				if (!this.validate()) {
					return;
				}

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
			})
			.catch(err => {
				console.log(err);
				this.error = err;
			});
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
		this.ngOnInit();
		this.onCreateMatchSuccess.emit(result);
	}

	ngOnInit() {
		this.matchDateOptions = this.getDefaultPickerOptions();

		this.error = null;
		this.isFinal = false;
		this.isEditingMatch = false;
		this.match = new Match();
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
	}

	private getDefaultPickerOptions() {
		return {
			monthsFull: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
				'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
			monthsShort: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
			weekdaysFull: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
			weekdaysShort: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'],
			today: 'Hoje',
			clear: 'Limpar',
			close: 'Fechar',
			max: new Date(),
			format: 'yyyy-mm-dd'
		};
	}
}
