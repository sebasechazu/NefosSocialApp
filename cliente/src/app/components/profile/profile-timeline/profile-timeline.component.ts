import { Component, OnInit, Input } from '@angular/core';
// ------------------------------------------------------------------------------------------------
// MODELOS
// ------------------------------------------------------------------------------------------------
import { User } from '../../../models/user';
// ------------------------------------------------------------------------------------------------
// SERVICIOS
// ------------------------------------------------------------------------------------------------
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-profile-timeline',
  templateUrl: './profile-timeline.component.html',
  styleUrls: ['./profile-timeline.component.css']
})
export class ProfileTimelineComponent implements OnInit {

  public user: User;

  constructor(
    private profileService: ProfileService
  ) { }

  ngOnInit() {
    this.profileService.userSelect.subscribe(us => this.user = us);
  }

}
