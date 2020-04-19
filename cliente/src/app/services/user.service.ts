// --------------------------------------------------------------------------------------------
// IMPORTS
// --------------------------------------------------------------------------------------------
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
// --------------------------------------------------------------------------------------------
// VARIABLES GLOBALES
// --------------------------------------------------------------------------------------------
import { GLOBAL } from './global';
// --------------------------------------------------------------------------------------------
// MODELO
// --------------------------------------------------------------------------------------------
import { User } from '../models/user';

@Injectable()
export class UserService {

    public url: string;
    public user: User;
    public identity;
    public token;
    public stats;
    public id;

    constructor(public http: HttpClient) {
        this.url = GLOBAL.url;
    }
    // --------------------------------------------------------------------------------------------
    // REGISTRO USUARIO
    // --------------------------------------------------------------------------------------------
    register(user: User): Observable<any> {
        const params = JSON.stringify(user);
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post(this.url + 'register', params, { headers });
    }
    // --------------------------------------------------------------------------------------------
    // IDENTIFICAR USUARIO
    // --------------------------------------------------------------------------------------------
    signup(user: any, gettoken = null): Observable<any> {
        if (gettoken != null) {
            user.gettoken = gettoken;

        }

        const params = JSON.stringify(user);
        const headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this.http.post(this.url + 'login', params, { headers });
    }
    // --------------------------------------------------------------------------------------------
    // OBTENER IDENTIDAD USUARIO
    // --------------------------------------------------------------------------------------------
    getIdentity() {
        const identity = JSON.parse(localStorage.getItem('identity'));

        if (identity !== 'undefined') {
            this.identity = identity;
        } else {
            this.identity = null;
        }
        return this.identity;
    }
    // --------------------------------------------------------------------------------------------
    // OBTENER TOKEN DE UN USUARIO
    // --------------------------------------------------------------------------------------------
    getToken() {
        const token = localStorage.getItem('token');
        if (token !== 'undefined') {
            this.token = token;
        } else {
            this.token = null;
        }
        return this.token;
    }
    // --------------------------------------------------------------------------------------------
    // OBTENER INFO DE UN USUARIO
    // --------------------------------------------------------------------------------------------
    getStats() {
        const stats = JSON.parse(localStorage.getItem('stats'));
        if (stats !== 'undefined') {
            this.stats = stats;
        } else {
            this.stats = stats;
        }
        return this.stats;
    }
    // --------------------------------------------------------------------------------------------
    // OBTENER CONTADORES DE UN USUARIO
    // --------------------------------------------------------------------------------------------
    getCounters(userId = null): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', this.getToken());
        if (userId != null) {
            return this.http.get(this.url + 'counters/' + userId, { headers });
        } else {
            return this.http.get(this.url + 'counters/', { headers });
        }
    }
    // --------------------------------------------------------------------------------------------
    // ACTUALIZAR USUARIOS
    // --------------------------------------------------------------------------------------------
    updateUser(user: User): Observable<any> {
        const params = JSON.stringify(user);
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', this.getToken());

        return this.http.put(this.url + 'update-user/' + user._id, params, { headers });

    }
    // --------------------------------------------------------------------------------------------
    // OBTENER USUARIOS
    // --------------------------------------------------------------------------------------------
    getUsers(page = null): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', this.getToken());

        return this.http.get(this.url + 'users/' + page, { headers });
    }
    // --------------------------------------------------------------------------------------------
    // OBTENER USUARIO
    // --------------------------------------------------------------------------------------------
    getUser(id): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', this.getToken());

        return this.http.get(this.url + 'user/' + id, { headers });

    }

}
