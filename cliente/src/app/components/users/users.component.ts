import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [UserService]
})
export class UsersComponent implements OnInit {

  public title: string;
  public identity;
  public token;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {
  this.title = 'Gente';
  this.identity = this.userService.getIdentity();
  this.token = this.userService.getToken();
  }

  ngOnInit() {
    console.log('users componente a sido cargado');
  }

}
