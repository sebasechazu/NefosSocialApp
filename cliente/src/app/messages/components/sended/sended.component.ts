import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sended',
  templateUrl: './sended.component.html'
})
export class SendedComponent implements OnInit {
  public title;

  constructor() {
    this.title = 'Mensajes Enviados';
   }

  ngOnInit() {
    console.log('Componente de mensajes enviados cargado');
  }

}
