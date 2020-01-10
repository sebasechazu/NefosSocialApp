import { Component,DoCheck } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements DoCheck{
  public title: string;
  public identity;

  constructor(
    private _userService: UserService,

  ) {
    this.title = 'NefosSocial';
  }

  ngDoCheck() {
    this.identity = this._userService.getIdentity();
  }
}
