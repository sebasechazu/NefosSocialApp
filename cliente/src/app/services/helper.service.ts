// --------------------------------------------------------------------------------------------
// IMPORTS
// --------------------------------------------------------------------------------------------
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class HelperService {

    private estado = new BehaviorSubject<string>('esperando...');

    public nuevoEstado = this.estado.asObservable();

    public cambiarEstado(st: string): void {
        this.estado.next(st);
        console.log('estado desde el servicio ' + st);
    }

}
