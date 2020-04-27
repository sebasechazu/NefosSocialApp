import { Component, OnInit } from '@angular/core';
// ------------------------------------------------------------------------------------------------
// RUTEO
// ------------------------------------------------------------------------------------------------
import { ActivatedRoute, Router, Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
// ------------------------------------------------------------------------------------------------

@Component({
  selector: 'app-profile-followed',
  templateUrl: './profile-followed.component.html'

})
export class ProfileFollowedComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService) { }

  ngOnInit() {
  }

}
