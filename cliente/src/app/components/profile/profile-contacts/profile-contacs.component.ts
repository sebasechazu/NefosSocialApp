import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { FollowService } from 'src/app/services/follow.service';
import { ProfileService } from 'src/app/services/profile.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-profile-contacts',
  templateUrl: './profile-contacs.component.html'
})
export class ProfileContacsComponent implements OnInit {

  public user: User;
  public stats;
  public total;

  constructor(
    private profileService: ProfileService
  ) {
    this.profileService.userSelect.subscribe(us => this.user = us);
    this.profileService.statsSelect.subscribe(st => this.stats = st);
    this.total = (this.stats.following + this.stats.followed);
  }
  ngOnInit() {
    console.log(this.user.name);
  }

}
