// --------------------------------------------------------------------------------------------
// SERVICIO DE MENSAJES
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
import { Message } from '../models/message';

@Injectable({
    providedIn: 'root'
})
export class MessageService {

    public url: string;

    constructor(private http: HttpClient) {
        this.url = GLOBAL.url;
    }
    // --------------------------------------------------------------------------------------------
    // ENVIAR MENSAJES
    // --------------------------------------------------------------------------------------------
    addMessage(token, message): Observable<any> {
        const params = JSON.stringify(message);
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', token);
        return this.http.post(this.url + 'message', params, { headers });
    }
    // --------------------------------------------------------------------------------------------
    // MENSAJES RECIBIDOS
    // --------------------------------------------------------------------------------------------
    getMyMesagges(token, page = 1): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', token);
        return this.http.post(this.url + 'my-messages/' + page, { headers });
    }
    // --------------------------------------------------------------------------------------------
    // MENSAJES ENVIADOS
    // --------------------------------------------------------------------------------------------
    getEmmitMesagges(token, page = 1): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', token);
        return this.http.post(this.url + 'messages/' + page, { headers });
    }
}
