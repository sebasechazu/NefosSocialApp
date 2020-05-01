// ------------------------------------------------------------------------------------------------
// COMPONENTE MENSAJES ENVIADOS
// ------------------------------------------------------------------------------------------------
import { Component, OnInit, DoCheck } from '@angular/core';
// ------------------------------------------------------------------------------------------------
// RUTEO
// ------------------------------------------------------------------------------------------------
import { Router, ActivatedRoute, Params } from '@angular/router';
// ------------------------------------------------------------------------------------------------
// MODELOS
// ------------------------------------------------------------------------------------------------
import { Message } from '../../../models/message';
import { Follow } from '../../../models/follow';
import { User } from '../../../models/user';
// ------------------------------------------------------------------------------------------------
// SERVICIOS
// ------------------------------------------------------------------------------------------------
import { FollowService } from '../../../services/follow.service';
import { MessageService } from '../../../services/message.service';
import { UserService } from '../../../services/user.service';
// ------------------------------------------------------------------------------------------------
// VARIABLE GLOBAL
// ------------------------------------------------------------------------------------------------
import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'app-sended',
  templateUrl: './sended.component.html'
})
export class SendedComponent implements OnInit {
  public title;
  public message: Message;
  public messages: Message[];
  public identity;
  public token;
  public page;
  public pages;
  public url: string;
  public status;
  public follows;
  public nextPage;
  public prevPage;
  public total;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private followService: FollowService,
    private messageService: MessageService,
    private userService: UserService
  ) {
    this.title = 'Mensajes Enviados';
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    console.log('Componente de mensajes enviados cargado');
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
      this.getMessages(this.token, this.page);
    });
  }
  // ----------------------------------------------------------------------------------------------
  // OBTENER MENSAJES
  // ----------------------------------------------------------------------------------------------
  getMessages(token, page) {
    this.messageService.getEmmitMesagges(token, page).subscribe(
      response => {
        if (response.messages) {
          this.messages = response.messages;
          this.total = response.total;
          this.pages = response.pages;
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
