import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
// MODELO
import { Publication } from '../models/publication';

@Injectable()
export class PublicationService {
    public url: string;

    constructor(private http: HttpClient) {
        this.url = GLOBAL.url;
    }
    addPublication(token, publication): Observable<any> {
        const params = JSON.stringify(Publication);
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

        return this.http.post(this.url + 'publication', params, { headers });

    }

}

