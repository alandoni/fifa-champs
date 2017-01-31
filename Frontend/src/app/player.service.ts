import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Player } from './models/Player';
import { ApiRequestService } from './api-request.service';

@Injectable()
export class PlayerService {

	private url = '/players';

	constructor(private api: ApiRequestService) { }

	insert(nickname) : Observable<Player> {
		return this.api.post(this.url, {nickname: nickname});
	}

	update(id, nickname, pictureUrl) : Observable<Player> {
		return this.api.post(this.url + '/' + id, {nickname: nickname, picture: pictureUrl});
	}

	delete(id) : Observable<Player> {
		return this.api.delete(this.url + '/' + id);
	}

	getAll() : Observable<Player> {
		return this.api.get(this.url);
	}
}
