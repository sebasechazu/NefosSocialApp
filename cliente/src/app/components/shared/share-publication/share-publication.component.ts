// ------------------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------------------
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
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
import { UploadService } from '../../../services/upload.service';
// ------------------------------------------------------------------------------------------------
// VARIABLE GLOBAL
// ------------------------------------------------------------------------------------------------
import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'app-share-publication',
  templateUrl: './share-publication.component.html',
  styleUrls: ['./share-publication.component.css'],
  providers: [UserService, PublicationService, UploadService]
})
export class SharePublicationComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private uploadService: UploadService,
    private publicationService: PublicationService,
  ) {

    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = GLOBAL.url;
    this.publication = new Publication('', '', '', this.identity._id, '');
  }
  public title: string;
  public url: string;
  public identity;
  public token;
  public status: string;
  public publication: Publication;
  public estado: string;
  public filesToUpload: Array<File>;
  public showImage;
  // evento de salida
  @Output() enviar = new EventEmitter<string>();

  ngOnInit() {

  }
  // ----------------------------------------------------------------------------------------------
  // AGREGAR PUBLICACION
  // ----------------------------------------------------------------------------------------------
  onSubmit(form) {
    this.publicationService.addPublication(this.token, this.publication).subscribe(
      response => {
        if (response.publication) {
          // subir imagen
          this.uploadService.makeFileRequest(this.url + 'upload-img-pub/' + response.publication._id, [], this.filesToUpload, this.token, 'image')
            .then((result: any) => {
              this.publication.file = result.image;
              this.status = 'success';
              form.reset();

            });
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
  // AGREGAR FOTO A LA PUBLICACION
  // ----------------------------------------------------------------------------------------------
  fileChangeEvent(fileInput: any) {
    this.filesToUpload = (fileInput.target.files as Array<File>);
  }

  // ----------------------------------------------------------------------------------------------
  // EVENTO PARA ENVIAR A ACTUALIZAR LA PUBLICAION
  // ----------------------------------------------------------------------------------------------
  enviarEstado(event) {
    this.estado = 'enviado';
    this.enviar.emit(this.estado);
  }
  showThisImage(id) {
    this.showImage = id;
  }

}
