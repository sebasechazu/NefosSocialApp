// ------------------------------------------------------------------------------------------------
// COMPONENTE PUBLICACIONES DE USUARIO
// ------------------------------------------------------------------------------------------------
import { Component, OnInit, Input } from '@angular/core';
// ------------------------------------------------------------------------------------------------
// RUTEO
// ------------------------------------------------------------------------------------------------
import { Router, ActivatedRoute, Params } from '@angular/router';
// ------------------------------------------------------------------------------------------------
// MODELOS
// ------------------------------------------------------------------------------------------------
import { Publication } from '../../../../models/publication';
import { User } from '../../../../models/user';
// ------------------------------------------------------------------------------------------------
// SERVICIOS
// ------------------------------------------------------------------------------------------------
import { UserService } from '../../../../services/user.service';
import { PublicationService } from '../../../../services/publication.service';
import { ProfileService } from '../../../../services/profile.service';
// ------------------------------------------------------------------------------------------------
// VARIABLE GLOBAL
// ------------------------------------------------------------------------------------------------
import { GLOBAL } from '../../../../services/global';
// ------------------------------------------------------------------------------------------------
@Component({
  selector: 'app-user-publications',
  templateUrl: './user-publications.component.html'
})
export class UserPublicationsComponent implements OnInit {
  public url: string;
  public identity;
  public token;
  public status;
  public page;
  public total;
  public pages;
  public itemsPerPage;
  public publication: Publication;
  public publications: Publication[];
  public noMore = false;
  @Input() user;


  constructor(
    private userService: UserService,
    private publicationService: PublicationService,
  ) {
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = GLOBAL.url;
    this.page = 1;

  }
  ngOnInit() {
    this.getPublications(this.user._id, this.page);
    console.log(this.user.name);
  }
  actualizar() {
    this.getPublications(this.user._id, this.page);
  }
  // -----------------------------------------------------------------------------------------------
  // OBTENER PUBLICACIONES DESDE API
  // -----------------------------------------------------------------------------------------------
  getPublications(user, page, adding = false) {

    this.publicationService.getPublicationsUser(this.token, user, page).subscribe(
      response => {
        if (response.publications) {
          this.total = response.total_items;
          this.pages = response.pages;
          this.itemsPerPage = response.items_per_page;
          if (!adding) {
            this.publications = response.publications;
          } else {
            const arrayA = this.publications;
            const arrayB = response.publications;
            this.publications = arrayA.concat(arrayB);
            $('html, body').animate({ scrollTop: $('html').prop('scrollHeight') }, 500);
          }

        } else {
          this.status = 'error';
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
  // METODO PARA DESACTIVAR BOTON DE VER MAS
  // ----------------------------------------------------------------------------------------------
  viewMore() {
    this.page += 1;
    if (this.page === this.pages) {
      this.noMore = true;
    }
    this.getPublications(this.user._id, this.page, true);
  }
}

