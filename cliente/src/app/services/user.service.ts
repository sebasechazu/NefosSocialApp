import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user';
import { GLOBAL } from './global';



@Injectable()
export class UserService {
    public url: string;
    constructor(public _http: HttpClient) {
        this.url = GLOBAL.url;
    }
    register(user: User): Observable<any> {
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + 'register', params, { headers: headers });
    }
    signup(user: any,gettoken = null): Observable<any>{
        if (gettoken != null) {
            user.gettoken = gettoken;
            
        }

        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this._http.post(this.url+'login',params,{headers:headers});
    }
}