import { Component, OnInit, DoCheck} from '@angular/core';
import { UserService } from '../../../services/user.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [UserService]
})
export class NavbarComponent implements OnInit, DoCheck {
  public title: string;
  public identity;
  public url: string;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router

  ) {
    this.title = 'NefosSocial';
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    this.identity = this.userService.getIdentity();
    console.log(this.identity);
  }
  ngDoCheck() {
    this.identity = this.userService.getIdentity();
  }
  logout() {
    localStorage.clear();
    this.identity = null;

    this.router.navigate(['/home']);

  }
}
