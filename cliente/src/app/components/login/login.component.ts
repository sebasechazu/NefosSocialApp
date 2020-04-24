// ------------------------------------------------------------------------------------------------
// COMPONENTE LOGIN
// ------------------------------------------------------------------------------------------------
import { Component, OnInit } from '@angular/core';
// ------------------------------------------------------------------------------------------------
// ROUTING
// ------------------------------------------------------------------------------------------------
import { Router, ActivatedRoute, Params } from '@angular/router';
// ------------------------------------------------------------------------------------------------
// MODELOS
// ------------------------------------------------------------------------------------------------
import { User } from '../../models/user';
// ------------------------------------------------------------------------------------------------
// SERVICIOS
// ------------------------------------------------------------------------------------------------
import { UserService } from '../../services/user.service';
// ------------------------------------------------------------------------------------------------
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'

})
export class LoginComponent implements OnInit {

  public user: User;
  public status: string;
  public identity;
  public token;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService

  ) {
    this.user = new User('', '', '', '', '', '', 'ROLE_USER', '');
  }
  ngOnInit() {
  }
  // ----------------------------------------------------------------------------------------------
  // LOGEARSE EN EL SITIO
  // ----------------------------------------------------------------------------------------------
  onSubmit() {
    // Otener los datos del usuario que intenta
    this.userService.signup(this.user).subscribe(
      response => {
        this.identity = response.user;
        if (!this.identity || !this.identity._id) {
          this.status = 'error';
        } else {
          // PERSISTIR DATOS DEL USUARIO
          localStorage.setItem('identity', JSON.stringify(this.identity));
          // CONSEGUIR EL TOQUEN
          this.getToken();
        }
      }, error => {
        const errorMessage = error as any;
        console.log(errorMessage);
        if (errorMessage != null) {
          this.status = 'error';
        }
      }
    );
  }
  // ----------------------------------------------------------------------------------------------
  // OBTENER TOKEN VERIFICAION
  // ----------------------------------------------------------------------------------------------
  getToken() {
    this.userService.signup(this.user, 'true').subscribe(
      response => {
        this.token = response.token;
        if (this.token.lenght <= 0) {
          this.status = 'error';
        } else {
          // PERSISTIR TOKEN DEL USUARIO
          localStorage.setItem('token', JSON.stringify(this.token));
          // CONSEGUIR LOS CONTADORES DEL USUARIO
          this.getCounters();
        }
      }, error => {
        const errorMessage = error as any;
        console.log(errorMessage);
        if (errorMessage != null) {
          this.status = 'error';

        }
      }
    );
  }
  // ----------------------------------------------------------------------------------------------
  // OBTENER CONTADORES
  // ----------------------------------------------------------------------------------------------
  getCounters() {
    this.userService.getCounters().subscribe(
      response => {
        localStorage.setItem('stats', JSON.stringify(response));
        this.status = 'success';
        this.router.navigate(['/']);
      },
      error => {
        console.log(error as any);
      }
    );
  }
}
