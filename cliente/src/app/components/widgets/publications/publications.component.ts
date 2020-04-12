import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
// MODELOS
import { Publication} from '../../../models/publication';
// SERVICIOS
import { UserService } from '../../../services/user.service';
import { PublicationService} from '../../../services/publication.service';
// VARIABLE GLOBAL
import { GLOBAL } from '../../../services/global';


@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.css'],
  providers: [UserService, PublicationService]
})
export class PublicationsComponent implements OnInit {
  public title: string;
  public url: string;
  public identity;
  public token;
  public status;
  public publication: Publication;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,

  ) {
       this.title = 'timeline';
       this.identity = this.userService.getIdentity();
       this.token = this.userService.getToken();
       this.url = GLOBAL.url;

  }

  ngOnInit() {
    console.log('Componente timeline de publicaciones cargado Correctamente!!!');
  }


}
