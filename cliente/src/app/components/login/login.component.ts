import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public title: string;

  constructor() { 
    this.title = "identificate";
  }

  ngOnInit() {
    console.log('Componente de login cargando...'); 
  }

}
