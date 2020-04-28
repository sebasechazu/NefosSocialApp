// ------------------------------------------------------------------------------------------------
// COMPONENTE FOLLOWED
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
  selector: 'app-profile-followed',
  templateUrl: './profile-followed.component.html'

})
export class ProfileFollowedComponent implements OnInit {
  public url: string;
  public identity;
  public token;
  public page;
  public nextPage;
  public prevPage;
  public status: string;
  public total;
  public pages;
  public users: User[];
  public follows;
  public followed;
  public followUserOver;
  public user: User;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private followService: FollowService,
    private profileService: ProfileService
  ) {
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.profileService.userSelect.subscribe(us => this.user = us);
    this.url = GLOBAL.url;
    this.page = 1;
  }
  ngOnInit() {
    this.actualPage(this.page);
  }
  // ----------------------------------------------------------------------------------------------
  // ACTUALIZAR PAGINA
  // ----------------------------------------------------------------------------------------------
  actualPage(page) {
    this.nextPage = page + 1;
    this.prevPage = page - 1;
    // devolver listado de usuarios
    this.getFollows(this.user._id, page);
  }
  // ----------------------------------------------------------------------------------------------
  // OBTENER LISTA DE SEGUIDORES
  // ----------------------------------------------------------------------------------------------
  getFollows(userId, page) {
    this.followService.getFollowed(this.token, userId, page).subscribe(
      response => {
        if (!response.follows) {
          this.status = 'error';
        } else {
          this.total = response.total;
          this.followed = response.follows;
          this.pages = response.pages;
          this.follows = response.users_following;
          console.log(this.followed);
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
  // ACCION PARA EL BOTON DEJAR DE SEGUI
  // ----------------------------------------------------------------------------------------------
  // tslint:disable-next-line: variable-name
  mouseEnter(user_id) {
    this.followUserOver = user_id;
  }
  // tslint:disable-next-line: variable-name
  mouseLeave(user_id) {
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
  // ----------------------------------------------------------------------------------------------
  // AVANZAR UNA PAGINA
  // ----------------------------------------------------------------------------------------------
  siguiente() {
    this.page += 1;
    this.actualPage(this.page);
  }
  // ----------------------------------------------------------------------------------------------
  // RETROCEDER UNA PAGINA
  // ----------------------------------------------------------------------------------------------
  anterior() {
    this.page -= 1;
    this.actualPage(this.page);
  }
}
