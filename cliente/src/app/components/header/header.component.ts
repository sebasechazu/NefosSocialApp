import { Component, OnInit, DoCheck } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, DoCheck {
  public title: string;
  public identity;
  public url: string;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router

  ) {
    this.title = 'NefosSocial';
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    this.identity = this.userService.getIdentity();
    // funcion de jquery para que funcione el dropdown del boton de perfil
    // tslint:disable-next-line: only-arrow-functions
    $('.profile-triger').on('click', function(event) {
      event.stopPropagation();
      $('.profile-dropdown').slideToggle();
    });
  }
  ngDoCheck() {
    this.identity = this.userService.getIdentity();
  }
  logout() {
    localStorage.clear();
    this.identity = null;

    this.router.navigate(['/home']);

  }
}
