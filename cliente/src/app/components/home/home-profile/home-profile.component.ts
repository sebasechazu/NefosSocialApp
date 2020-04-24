// ------------------------------------------------------------------------------------------------
// COMPONENTE PROFILE BANNER
// ------------------------------------------------------------------------------------------------
import { Component, Input } from '@angular/core';
// SERVICIOS
// ------------------------------------------------------------------------------------------------
import { HomeService } from 'src/app/services/home.service';
import { UserService } from '../../../services/user.service';
// ------------------------------------------------------------------------------------------------
// VARIABLE GLOBAL
// ------------------------------------------------------------------------------------------------
import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'app-home-profile',
  templateUrl: './home-profile.component.html'
})
export class HomeProfileComponent {

  @Input()
  public url: string;
  @Input()
  public identity;
  @Input()
  public stats;

  constructor(
  ) {
   console.log(this.url);
  }
}
