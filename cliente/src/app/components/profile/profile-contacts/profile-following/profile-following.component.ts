// ------------------------------------------------------------------------------------------------
// COMPONENTE FOLLOWING
// ------------------------------------------------------------------------------------------------
import { Component, OnInit, Input } from '@angular/core';
// ------------------------------------------------------------------------------------------------
// RUTEO
// ------------------------------------------------------------------------------------------------
import { Router, ActivatedRoute, Params } from '@angular/router';
// ------------------------------------------------------------------------------------------------
// MODELOS
// ------------------------------------------------------------------------------------------------
import { User } from '../../../../models/user';
import { Follow } from '../../../../models/follow';
// ------------------------------------------------------------------------------------------------
// SERVICIOS
// ------------------------------------------------------------------------------------------------
import { UserService } from '../../../../services/user.service';
import { FollowService } from '../../../../services/follow.service';
import { ProfileService } from '../../../../services/profile.service';
// ------------------------------------------------------------------------------------------------
// VARIABLE GLOBAL
// ------------------------------------------------------------------------------------------------
import { GLOBAL } from '../../../../services/global';

@Component({
  selector: 'app-profile-following',
  templateUrl: './profile-following.component.html',

})
export class ProfileFollowingComponent implements OnInit {

  public url: string;
  public identity;
  public token;
  public page = 1;
  public nextPage;
  public prevPage;
  public status: string;
  public total;
  public pages;
  public user: User;
  public users: User[];
  public noMas;
  public noMenos;
  public follows;
  public following;
  public followUserOver;
  public userPageId;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private followService: FollowService,
    private profileService: ProfileService
  ) {
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = GLOBAL.url;
    this.profileService.userSelect.subscribe(us => this.user = us);
  }
  ngOnInit() {
    this.getFollows(this.user._id, this.page);
  }
  // ----------------------------------------------------------------------------------------------
  // OBTENER LISTA DE SEGUIDORES
  // ----------------------------------------------------------------------------------------------
  getFollows(userId, page) {
    this.followService.getFollowing(this.token, userId, page).subscribe(
      response => {
        if (!response.follows) {
          this.status = 'error';
        } else {
          console.log(response);
          this.total = response.total;
          this.following = response.follows;
          this.pages = response.pages;
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
  siguiente() {
    this.page += 1;
    if (this.page === this.pages) {
      this.noMas = true;
      console.log(this.page);
    }
    this.getFollows(this.user, this.page);
  }
  anterior() {
    this.page -= 1;
    if (this.page === this.pages) {
      this.noMenos = true;
    }
    this.getFollows(this.user, this.page);
  }

  // ----------------------------------------------------------------------------------------------
  // ACCION PARA EL BOTON DEJAR DE SEGUI
  // ----------------------------------------------------------------------------------------------
  mouseEnter(userId) {
    this.followUserOver = userId;
  }
  mouseLeave(userId) {
    this.followUserOver = 0;
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
