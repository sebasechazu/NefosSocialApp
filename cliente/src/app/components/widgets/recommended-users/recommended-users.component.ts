import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
// MODELOS
import { User } from '../../../models/user';
import { Follow } from '../../../models/follow';
// SERVICIOS
import { UserService } from '../../../services/user.service';
import { FollowService } from '../../../services/follow.service';
// VARIABLE GLOBAL
import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'app-recommended-users',
  templateUrl: './recommended-users.component.html',
  styleUrls: ['./recommended-users.component.css'],
  providers: [UserService, FollowService]
})
export class RecommendedUsersComponent implements OnInit {

  public url: string;
  public identity;
  public token;
  public status: string;
  public users: User[];
  public follows;
  public followUserOver;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private followService: FollowService
  ) {
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    console.log('Componente Usuarios recomendados a sido cargado');
    this.getUsers();
  }
  getUsers() {
    this.userService.getUsers().subscribe(
      response => {
        if (!response.users) {
          this.status = 'error';
        } else {
          this.users = response.users;
          this.follows = response.users_following;
        }
      },
      error => {
        const errorMessage = error as any;
        console.log(errorMessage);

        if (errorMessage != null) {
          this.status = 'error';
        }
      }
    );
  }

  // ----------------------------------------------------------------------------------------------
  // SEGUIR A UN USUARIO
  // ----------------------------------------------------------------------------------------------
  followUser(followed) {
    const follow = new Follow('', this.identity._id, followed);

    this.followService.addFollow(this.token, follow).subscribe(
      response => {
        if (!response.follow) {
          this.status = 'error';
        } else {
          this.status = 'success';
          this.follows.push(followed);
        }
      },
      error => {
        const errorMessage = error as any;
        console.log(errorMessage);

        if (errorMessage != null) {
          this.status = 'error';
        }
      });
  }
  // ----------------------------------------------------------------------------------------------
  // DEJAR DE SEGUIR A UN USUARIO
  // ----------------------------------------------------------------------------------------------
  unFollowUser(followed) {
    this.followService.deleteFollow(this.token, followed).subscribe(
      response => {
        const search = this.follows.indexOf(followed);
        if (search !== -1) {
          this.follows.splice(search, 1);
        }
      },
      error => {
        const errorMessage = error as any;
        console.log(errorMessage);

        if (errorMessage != null) {
          this.status = 'error';
        }
      });

  }


}
