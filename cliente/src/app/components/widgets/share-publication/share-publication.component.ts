import { Component, OnInit } from '@angular/core';
// MODELOS
import { Publication } from '../../../models/publication';
// SERVICIOS
import { UserService } from '../../../services/user.service';
import { PublicationService } from '../../../services/publication.service';
// VARIABLE GLOBAL
import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'app-share-publication',
  templateUrl: './share-publication.component.html',
  styleUrls: ['./share-publication.component.css'],
  providers: [UserService, PublicationService]
})
export class SharePublicationComponent implements OnInit {

  public title: string;
  public url: string;
  public identity;
  public token;
  public status: string;
  public publication: Publication;


  constructor(
    private userService: UserService,
    private publicationService: PublicationService) {

    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = GLOBAL.url;
    this.publication = new Publication('', '', '', this.identity.id, '');
  }

  ngOnInit() {
    console.log('componente compartir publicacion cargado');
  }
  onSubmit(form) {
    this.publicationService.addPublication(this.token, this.publication).subscribe(
      response => {
        if (response.publication) {
          // this.publication = response.publication;
          this.status = 'success';
          form.reset();
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
