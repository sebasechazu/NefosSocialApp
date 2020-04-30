import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html'

})
export class MainComponent implements OnInit {
  public title;

  constructor(

    private route: ActivatedRoute,
    private router: Router

  ) {
    this.title = 'mensaje privados';
  }

  ngOnInit() {
    console.log('main componente cargado');
  }

}
