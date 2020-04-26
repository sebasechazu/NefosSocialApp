// ------------------------------------------------------------------------------------------------
// PROFILE TIMELINE
// ------------------------------------------------------------------------------------------------
import { Component, OnInit, Input } from '@angular/core';
// ------------------------------------------------------------------------------------------------
// MODELOS
// ------------------------------------------------------------------------------------------------
import { User } from '../../../models/user';
// ------------------------------------------------------------------------------------------------
// SERVICIOS
// ------------------------------------------------------------------------------------------------
import { ProfileService } from 'src/app/services/profile.service';
import { UserService } from 'src/app/services/user.service';
// ------------------------------------------------------------------------------------------------
@Component({
  selector: 'app-profile-timeline',
  templateUrl: './profile-timeline.component.html'

})
export class ProfileTimelineComponent implements OnInit {

  public user: User;
  public identity;

  constructor(
    private profileService: ProfileService,
    private userService: UserService
  ) {
    this.identity = this.userService.getIdentity();
    this.profileService.userSelect.subscribe(us => this.user = us);
  }
  ngOnInit() {
  }
}
