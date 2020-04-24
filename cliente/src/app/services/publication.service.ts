// --------------------------------------------------------------------------------------------
// SERVICIO DE PUBLICACIONES
// --------------------------------------------------------------------------------------------
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// --------------------------------------------------------------------------------------------
// ROUTING
// --------------------------------------------------------------------------------------------
import { HttpClient, HttpHeaders } from '@angular/common/http';
// --------------------------------------------------------------------------------------------
// VARIABLES GLOBALES
// --------------------------------------------------------------------------------------------
import { GLOBAL } from './global';
// --------------------------------------------------------------------------------------------
// MODELO
// --------------------------------------------------------------------------------------------
import { Publication } from '../models/publication';

@Injectable()
export class PublicationService {
    public url: string;
    constructor(private http: HttpClient) {
        this.url = GLOBAL.url;
    }
    // --------------------------------------------------------------------------------------------
    // CREAR PUBLICACION
    // --------------------------------------------------------------------------------------------
    addPublication(token, publication): Observable<any> {
        const params = JSON.stringify(publication);
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

        return this.http.post(this.url + 'publication', params, { headers });
    }
    // --------------------------------------------------------------------------------------------
    // LISTAR PUBLICACIONES
    // --------------------------------------------------------------------------------------------
    getPublications(token, page = 1): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

        return this.http.get(this.url + 'publications/' + page, { headers });
    }
    // --------------------------------------------------------------------------------------------
    // LISTAR PUBLICACIONES DE USUARIO
    // --------------------------------------------------------------------------------------------
    getPublicationsUser(token, userId, page = 1): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

        return this.http.get(this.url + 'publications-user/' + userId + '/' + page, { headers });
    }
    // --------------------------------------------------------------------------------------------
    // BORRAR PUBLICACION
    // --------------------------------------------------------------------------------------------
    deletePublications(token, id): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

        return this.http.delete(this.url + 'publication/' + id, { headers });
    }
}

