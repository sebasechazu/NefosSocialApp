// ------------------------------------------------------------------------------------------------
// COMPONENTE PROFILE BANNER
// ------------------------------------------------------------------------------------------------
import { Component, OnInit } from '@angular/core';
// ------------------------------------------------------------------------------------------------
// MODELOS
// ------------------------------------------------------------------------------------------------
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
// ------------------------------------------------------------------------------------------------
// SERVICIOS
// ------------------------------------------------------------------------------------------------
import { UserService } from '../../services/user.service';
import { HomeService } from 'src/app/services/home.service';
// ------------------------------------------------------------------------------------------------
// VARIABLE GLOBAL
// ------------------------------------------------------------------------------------------------
import { GLOBAL } from '../../services/global';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  public url: string;
  public identity;
  public stats;
  public token;
  public status: string;

  constructor(
    private userService: UserService,
    private homeService: HomeService) {

    this.identity = this.userService.getIdentity();
    this.homeService.selectIdentity(this.identity);
    this.token = this.userService.getToken();
    this.homeService.selectToken(this.token);
    this.stats = this.userService.getStats();
    this.homeService.selectStats(this.stats);
    this.url = GLOBAL.url;

  }
  ngOnInit(
  ) {


  }
}
