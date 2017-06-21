import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { environment } from '../environments/environment';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
@Injectable()
export class TeamPickService {

   private baseUrl = environment.API_URL;
   private url = "/team-pick"
   constructor(private http: Http) {
         var obj;
         this.getJSON().subscribe(data => obj=data, error => console.log(error));
    }

    public getJSON(): Observable<any> {
         return this.http.get(this.baseUrl + this.url)
                         .map((res:any) => res.json())
                         .catch((error:any) => { return this.handleError(error); });

     }

      private handleError(error: any) {
            console.log(error);
            return Observable.throw({description: error});
      }
}