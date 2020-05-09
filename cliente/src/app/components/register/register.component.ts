// ------------------------------------------------------------------------------------------------
// COMPONENTE REGISTRO
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

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {

  public user: User;
  public status: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService

  ) {
    this.user = new User(
      '',
      '',
      '',
      '',
      '',
      '',
      'ROLE_USER',
      ''
    );
  }
  ngOnInit() {
  }
  // ------------------------------------------------------------------------------------------------
  // FORMULARIO DE REGISTRO
  // ------------------------------------------------------------------------------------------------
  onSubmit(registerForm) {
    this.userService.register(this.user).subscribe(
      response => {
        if (response.user && response.user._id) {
          this.status = 'success';
          registerForm.reset();
        } else {
          this.status = 'error';
        }
      },
      error => {
        console.log(error as any);
      }
    );
  }
}
