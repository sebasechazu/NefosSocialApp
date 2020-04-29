import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-received',
  templateUrl: './received.component.html'
})
export class ReceivedComponent implements OnInit {
  public title;

  constructor() {
    this.title = 'Mensajes Recibidos';
  }

  ngOnInit() {
    console.log('Componentes de mensajes recibidos cargadp');
  }

}
