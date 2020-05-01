// ------------------------------------------------------------------------------------------------
// COMPONENTE ENVIAR MENSAJE
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
  selector: 'app-add',
  templateUrl: './add.component.html'
})
export class AddComponent implements OnInit {
  public title;
  public message: Message;
  public identity;
  public token;
  public url: string;
  public status;
  public follows;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private followService: FollowService,
    private messageService: MessageService,
    private userService: UserService
  ) {
    this.title = 'Enviar Mensajes';
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.message = new Message('', this.identity._id, '', '', '', '');
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    console.log('Componnete enviar mensaje cargado');
    this.getMyFollows();
  }
  onSubmit(form) {
    console.log(this.message);
    this.messageService.addMessage(this.token, this.message).subscribe(
      response => {
        if (response.message) {
          this.status = 'success';
          form.reset();
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

  getMyFollows() {
    this.followService.getMyFollows(this.token).subscribe(
      response => {
        this.follows = response.follows;

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
