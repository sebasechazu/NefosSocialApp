import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html'

})
export class MainComponent implements OnInit {
  public title;

  constructor() { 
    this.title = 'menssaje privados'
  }

  ngOnInit() {
    console.log('main componente cargado')
  }

}
