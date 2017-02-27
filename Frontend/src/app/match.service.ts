import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiRequestService } from './api-request.service';
import { Match } from './models/Match';

@Injectable()
export class MatchService {

	private url = '/matches';

	constructor(private api: ApiRequestService) { }

	insert(match: Match) : Observable<Match> {
		return this.api.post(this.url, match);
	}

	update(id, match: Match) : Observable<Match> {
		return this.api.post(this.url + '/' + id, match);
	}

	delete(id) : Observable<Match> {
		return this.api.delete(this.url + '/' + id);
	}

	getAll() : Observable<Match[]> {
		return this.api.get(this.url);
	}

	getByDates(minDate, maxDate) : Observable<Match[]> {
		return this.api.get(this.url + '?minDate=' + minDate + '&maxDate=' + maxDate);
	}

	getByChampionship(championshipId) : Observable<Match[]> {
		return this.api.get(this.url + '/' + championshipId);
	}

	getFinals() : Observable<Match[]> {
		return this.api.get(this.url + '?isFinal=true');
	}
}
