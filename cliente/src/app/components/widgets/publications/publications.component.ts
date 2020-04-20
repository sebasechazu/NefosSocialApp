// ------------------------------------------------------------------------------------------------
// COMPONENTE
// ------------------------------------------------------------------------------------------------
import { Component, OnInit, Input } from '@angular/core';
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
  @Input() estado: string;

  ngOnInit() {
    this.getPublications(this.page);

  }
  actualizar() {
    this.getPublications(this.page);
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
    this.getPublications(this.page, true);
  }
  // ----------------------------------------------------------------------------------------------
  // ELIMINAR PUBLICACION
  // ----------------------------------------------------------------------------------------------
  deletePublication(id) {
    this.publicationService.deletePublications(this.token, id).subscribe(
      response => {
        this.actualizar();
      },
      error => {
        const errorMessage = error as any;
        console.log(errorMessage);
        if (errorMessage != null) {
          this.status = 'error';
        }
      }
    )
  }


}
