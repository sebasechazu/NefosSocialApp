// ------------------------------------------------------------------------------------------------
// COMPONENTE
// ------------------------------------------------------------------------------------------------
import { Component, OnInit } from '@angular/core';
// ------------------------------------------------------------------------------------------------
// RUTEO
// ------------------------------------------------------------------------------------------------
import { Router, ActivatedRoute, Params } from '@angular/router';
// ------------------------------------------------------------------------------------------------
// MODELOS
// ------------------------------------------------------------------------------------------------
import { Publication } from '../../../models/publication';
// ------------------------------------------------------------------------------------------------
// SERVICIOS
// ------------------------------------------------------------------------------------------------
import { UserService } from '../../../services/user.service';
import { PublicationService } from '../../../services/publication.service';
import { HelperService } from '../../../services/helper.service';
// ------------------------------------------------------------------------------------------------
// VARIABLE GLOBAL
// ------------------------------------------------------------------------------------------------
import { GLOBAL } from '../../../services/global';


@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.css'],
  providers: [UserService, PublicationService]
})
export class PublicationsComponent implements OnInit {


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private publicationService: PublicationService,
    private helper: HelperService

  ) {
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = GLOBAL.url;
    this.page = 1;

  }
  public url: string;
  public identity;
  public token;
  public status;
  public publication: Publication;
  public page;
  public total;
  public pages;
  public itemsPerPage;
  public publications: Publication[];
  public noMore = false;
  // estado de las publicaciones
  public estado: string;
  public nuevoEstado: string;

  ngOnInit() {

    this.helper.nuevoEstado.subscribe(st => this.estado = st);

    if (this.estado === 'actualizar' || this.estado === 'esperando...') {
      this.getPublications(this.page);
      this.helper.cambiarEstado('actualizado');
      console.log('desde PublicationComponent ' + this.estado);
    }
  }
  // -----------------------------------------------------------------------------------------------
  // OBTENER PUBLICACIONES DESDE API
  // -----------------------------------------------------------------------------------------------
  getPublications(page, adding = false) {
    this.publicationService.getPublications(this.token, page).subscribe(
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

            $('html, body').animate({ scrollTop: $('body').prop('scrollHeight') }, 500);
          }

          if (page > this.pages) {
            // this.router.navigate(['/home']);
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
    if (this.publications.length === this.total) {
      this.noMore = true;
    } else {
      this.page += 1;
    }
    this.getPublications(this.page, true);
  }


}
