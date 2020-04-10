import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/global';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  public title: string;
  public identity;
  public url: string;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    this.identity = this.userService.getIdentity();
  }

}
