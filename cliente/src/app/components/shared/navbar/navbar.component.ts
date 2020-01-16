import { Component, OnInit,DoCheck} from '@angular/core';
import { UserService } from '../../../services/user.service';
import {Router,ActivatedRoute,Params} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [UserService]
})
export class NavbarComponent implements OnInit,DoCheck {
  public title: string;
  public identity;

  constructor(
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router

  ) {
    this.title = 'NefosSocial';
  }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    console.log(this.identity);
  }
  ngDoCheck() {
    this.identity = this._userService.getIdentity();
  }
  logout(){
    localStorage.clear();
    this.identity = null;

    this._router.navigate(['/home']);

  }
}
