// ------------------------------------------------------------------------------------------------
// COMPONENTE PROFILE BANNER
// ------------------------------------------------------------------------------------------------
import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class HomeComponent {

  public url: string;
  public identity;
  public stats;
  public token;
  public status: string;

  constructor(
    private userService: UserService) {
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.stats = this.userService.getStats();
    this.url = GLOBAL.url;
  }
}
