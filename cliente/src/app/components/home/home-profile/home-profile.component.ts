// ------------------------------------------------------------------------------------------------
// COMPONENTE PROFILE BANNER
// ------------------------------------------------------------------------------------------------
import { Component, OnInit } from '@angular/core';
// SERVICIOS
// ------------------------------------------------------------------------------------------------
import { HomeService } from 'src/app/services/home.service';
// ------------------------------------------------------------------------------------------------
// VARIABLE GLOBAL
// ------------------------------------------------------------------------------------------------
import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'app-home-profile',
  templateUrl: './home-profile.component.html'
})
export class HomeProfileComponent implements OnInit {

  public url: string;
  public identity;
  public stats;
  public token;
  public status: string;

  constructor(
    private homeService: HomeService
  ) {
    this.url = GLOBAL.url;
  }
  ngOnInit() {
    this.homeService.identitySelect.subscribe(id => this.identity = id);
    this.homeService.statsSelect.subscribe(st => this.stats = st);
  }

}
