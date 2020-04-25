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
import { Follow } from '../models/follow';

@Injectable()
export class FollowService {
    public url: string;
    constructor(private http: HttpClient) {
        this.url = GLOBAL.url;
    }
    // --------------------------------------------------------------------------------------------
    // CREAR SEGUIMIENTO
    // --------------------------------------------------------------------------------------------
    addFollow(token, follow): Observable<any> {

        const params = JSON.stringify(follow);
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', token);

        return this.http.post(this.url + 'follow/', params, { headers });
    }
    // --------------------------------------------------------------------------------------------
    // ELIMINAR UN SEGUIMIENTO
    // --------------------------------------------------------------------------------------------
    deleteFollow(token, id): Observable<any> {

        const headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', token);

        return this.http.delete(this.url + 'follow/' + id, { headers });
    }
    // --------------------------------------------------------------------------------------------
    // LISTA DE SEGUIMIENTO
    // --------------------------------------------------------------------------------------------
    getFollowing(token, id = null, page): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', token);
        const url = this.url + 'following';
        if (id != null) {
            let url = this.url + 'following/' + id + '/' + page;
        }
        return this.http.get(url, { headers });
    }

}