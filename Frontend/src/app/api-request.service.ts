import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AppSettings } from './app-settings';

@Injectable()
export class ApiRequestService {

	private baseUrl = AppSettings.API_URL;
	public http;

	constructor(http: Http) { 
		if (this.http == null) {
			console.log("Creating new HTTP");
			this.http = http;
		}
	}

	public post(url, data) : Observable<any> {
		return this.http.post(this.baseUrl + url, data, { withCredentials: true }).map((response) => { 
			return response.json();
		}).catch((error: Response | any) => {
			return this.handleError(error);
		});
	}

	public get(url) : Observable<any> {
		return this.http.get(this.baseUrl + url).map((response) => { 
			return response.json();
		}).catch((error: Response | any) => {
			return this.handleError(error);
		});
	}

	public delete(url) : Observable<any> {
		return this.http.delete(this.baseUrl + url, { withCredentials: true }).map((response) => { 
			return response.json();
		}).catch((error: Response | any) => {
			return this.handleError(error);
		});
	}

	handleError(error: Response | any) {
		console.log(error);

		if (error.json().description) {
			return Observable.throw(error.json());
		} else {
			return Observable.throw({description: error});
		}
	}
}
