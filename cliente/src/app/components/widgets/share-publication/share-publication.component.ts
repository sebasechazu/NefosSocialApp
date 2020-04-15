// ------------------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------------------
import { Component, OnInit } from '@angular/core';
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
  selector: 'app-share-publication',
  templateUrl: './share-publication.component.html',
  styleUrls: ['./share-publication.component.css'],
  providers: [UserService, PublicationService, HelperService]
})
export class SharePublicationComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private publicationService: PublicationService,
    private helper: HelperService) {

    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = GLOBAL.url;
    this.publication = new Publication('', '', '', this.identity.id, '');
  }

  public title: string;
  public url: string;
  public identity;
  public token;
  public status: string;
  public publication: Publication;
  // estado de las publicaciones
  public estado: string;
  public nuevoEstado: string;

  ngOnInit() {

    this.helper.nuevoEstado.subscribe(st => this.estado = st);
  }
  // ----------------------------------------------------------------------------------------------
  // AGREGAR PUBLICACION
  // ----------------------------------------------------------------------------------------------
  onSubmit(form) {
    this.publicationService.addPublication(this.token, this.publication).subscribe(
      response => {
        if (response.publication) {
          // this.publication = response.publication;
          this.status = 'success';
          form.reset();
          console.log(this.estado);
          this.helper.cambiarEstado('actualizar');
          console.log('desde sharedComponent ' + this.estado);
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

}
