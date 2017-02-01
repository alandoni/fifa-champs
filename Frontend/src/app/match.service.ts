import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiRequestService } from './api-request.service';
import { Match } from './models/Match';
@Injectable()
export class MatchService {

	private url = '/matches';

	constructor(private api: ApiRequestService) { }

	insert(player1Id, player2Id, player3Id, player4Id, team1score, team2score, date, championshipId) : Observable<Match> {
		return this.api.post(this.url, {player1: player1Id, 
										player2: player2Id,
										player3: player3Id,
										player4: player4Id,
										team1score: team1score,
										team2score: team2score,
										date: date,
										championship: championshipId,
										});
	}

	update(id, player1Id, player2Id, player3Id, player4Id, team1score, team2score, date, championshipId) : Observable<Match> {
		return this.api.post(this.url + '/' + id, {player1: player1Id, 
										player2: player2Id,
										player3: player3Id,
										player4: player4Id,
										team1score: team1score,
										team2score: team2score,
										date: date,
										championship: championshipId,
										});
	}

	delete(id) : Observable<Match> {
		return this.api.delete(this.url + '/' + id);
	}

	getAll() : Observable<Match> {
		return this.api.get(this.url);
	}

}
