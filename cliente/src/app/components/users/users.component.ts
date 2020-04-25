// ------------------------------------------------------------------------------------------------
//  COMPONENTE USUARIOS
// ------------------------------------------------------------------------------------------------
import { Component, OnInit } from '@angular/core';
// ------------------------------------------------------------------------------------------------
// ROUTING
// ------------------------------------------------------------------------------------------------
import { Router, ActivatedRoute, Params } from '@angular/router';
// ------------------------------------------------------------------------------------------------
// MODELOS
// ------------------------------------------------------------------------------------------------
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
// ------------------------------------------------------------------------------------------------
// SERVICIOS
// ------------------------------------------------------------------------------------------------
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
// ------------------------------------------------------------------------------------------------
// VARIABLE GLOBAL
// ------------------------------------------------------------------------------------------------
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {

  public title: string;
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
  public followUserOver;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private followService: FollowService
  ) {
    this.title = 'Gente';
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    this.actualPage();
  }
  // ----------------------------------------------------------------------------------------------
  // ACTUALIZAR PAGINA
  // ----------------------------------------------------------------------------------------------
  actualPage() {
    this.route.params.subscribe(params => {
      let page = + params.page;
      this.page = page;
      if (!params.page) {
        page = 1;
      }
      if (!page) {
        page = 1;
      } else {
        this.nextPage = page + 1;
        this.prevPage = page - 1;
        if (this.prevPage <= 0) {
          this.prevPage = 1;
        }
      }
      // devolver listado de usuarios
      this.getUsers(page);
    });
  }
  // ----------------------------------------------------------------------------------------------
  // OBTENER LISTA DE USUARIOS
  // ----------------------------------------------------------------------------------------------
  getUsers(page) {
    this.userService.getUsers(page).subscribe(
      response => {
        if (!response.users) {
          this.status = 'error';
        } else {
          this.total = response.total;
          this.users = response.users;
          this.pages = response.pages;
          this.follows = response.users_following;

          page > this.pages ? this.router.navigate(['/usuarios', 1]) : console.log(this.pages);
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
}
