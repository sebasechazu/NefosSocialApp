import { Component, OnInit } from '@angular/core';
// MODELOS
import { User } from '../../../models/user';
import { Follow } from '../../../models/follow';
// SERVICIOS
import { UserService } from '../../../services/user.service';
import { FollowService } from '../../../services/follow.service';
// VARIABLE GLOBAL
import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'app-profile-banner',
  templateUrl: './profile-banner.component.html',
  styleUrls: ['./profile-banner.component.css'],
  providers: [UserService, FollowService]
})
export class ProfileBannerComponent implements OnInit {

  public title: string;
  public url: string;
  public identity;
  public stats;
  public token;
  public status: string;

  constructor(private userService: UserService) {
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.stats = this.userService.getStats();
    this.url = GLOBAL.url;

  }

  ngOnInit() {

  }

}
