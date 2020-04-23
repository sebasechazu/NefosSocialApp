import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {

  public title: string;
  public user: User;
  public status: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService

  ) {
    this.title = 'Registrate';
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
    console.log('Componente de register cargado...');
  }

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
