// ------------------------------------------------------------------------------------------------
// COMPONENTE
// ------------------------------------------------------------------------------------------------
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  public estadoCambiado: string;

  OnInit() {
    console.log(this.estadoCambiado);
  }
  procesarEstado(event) {
    console.log(event);
  }

}
