import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html'
})
export class AddComponent implements OnInit {
  public title;

  constructor() {
    this.title = 'Enviar Mensajes';
  }

  ngOnInit() {
    console.log('Componnete enviar mensaje cargado');
  }

}
