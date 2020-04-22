// ------------------------------------------------------------------------------------------------
// COMPONENTE PROFILE
// ------------------------------------------------------------------------------------------------
import { Component, OnInit } from '@angular/core';
// ------------------------------------------------------------------------------------------------
// SERVICIOS
// ------------------------------------------------------------------------------------------------
import { UserService } from 'src/app/services/user.service';
import { FollowService } from 'src/app/services/follow.service';
import { ProfileService } from 'src/app/services/profile.service';
// ------------------------------------------------------------------------------------------------
// MODELOS
// ------------------------------------------------------------------------------------------------
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
// ------------------------------------------------------------------------------------------------
// RUTEO
// ------------------------------------------------------------------------------------------------
import { ActivatedRoute, Router, Params } from '@angular/router';
// ------------------------------------------------------------------------------------------------
// VARIABLES GLOBALES
// ------------------------------------------------------------------------------------------------
import { GLOBAL } from 'src/app/services/global';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [UserService, FollowService]
})
export class ProfileComponent implements OnInit {

  public title: string;
  public user: User;
  public identity;
  public token;
  public status: string;
  public url: string;
  public stats;
  public followed;
  public following;
  public followUserOver;


  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private followService: FollowService,
    private profileService: ProfileService
  ) {
    this.url = GLOBAL.url;
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
  }

  ngOnInit() {
    this.identity = this.userService.getIdentity();
    this.profileService.userSelect.subscribe(us => this.user = us);
    this.profileService.statsSelect.subscribe(st => this.stats = st);
    this.loadPage();

  }
  // ----------------------------------------------------------------------------------------------
  // CARGAR PAGINA
  // ----------------------------------------------------------------------------------------------
  loadPage() {
    this.route.params.subscribe(params => {
      const id = params.id;

      this.getUser(id);
      this.getCounters(id);
    });
  }
  // ----------------------------------------------------------------------------------------------
  // OBTENER DATOS DE UN USUARIO
  // ----------------------------------------------------------------------------------------------
  getUser(id) {
    this.userService.getUser(id).subscribe(
      response => {
        if (response.user) {
          this.user = response.user;
          this.profileService.selectUser(this.user);
          if (response && response.following && response.following._id) {
            this.following = true;
          } else {
            this.following = false;
          }
          if (response && response.followed && response.followed._id) {
            this.followed = true;
          } else {
            this.followed = false;
          }
        } else {
          this.status = 'error';
        }
      },
      error => {
        const errorMessage = error as any;
        console.log(errorMessage);
        this.router.navigate(['/perfil', this.identity._id]);
      }
    );
  }
  // ----------------------------------------------------------------------------------------------
  // OBTENER CONTADORES DEL USUARIO
  // ----------------------------------------------------------------------------------------------
  getCounters(id) {
    this.userService.getCounters(id).subscribe(
      response => {
        this.stats = response;
        this.profileService.selectStats(this.stats);
      },
      error => {
        const errorMessage = error as any;
        console.log(errorMessage);

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
        this.following = true;
      },
      error => {
        const errorMessage = error as any;
        console.log(errorMessage);

      }
    );
  }
  // ----------------------------------------------------------------------------------------------
  // DEJAR DE SEGUIR A UN USUARIO
  // ----------------------------------------------------------------------------------------------
  unFollowUser(followed) {
    this.followService.deleteFollow(this.token, followed).subscribe(
      response => {
        this.following = false;

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
  mouseEnter(userId) {
    this.followUserOver = userId;
  }
  mouseLeave(useriD) {
    this.followUserOver = 0;
  }


}
