import { Component, OnInit,DoCheck} from '@angular/core';
import { UserService } from '../../../services/user.service';

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
}
