import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { UploadService } from '../../services/upload.service';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [UserService, UploadService]
})
export class UserEditComponent implements OnInit {

  public title: string;
  public user: User;
  public identity;
  public token;
  public status: string;
  public url: string;
  public filesToUpload: Array<File>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private uploadService: UploadService) {
    // variables del constructor
    this.title = 'Actualizar mis datos';
    this.user = this.userService.getIdentity();
    this.identity = this.user;
    this.token = this.userService.getToken();
    this.url = GLOBAL.url;

  }

  ngOnInit() {
    console.log(this.user);
    console.log('user-edit componet se ha cargado');
  }
  onSubmit() {
    console.log(this.user);
    this.userService.updateUser(this.user).subscribe(
      response => {
        if (!response.user) {
          this.status = 'error';
        } else {
          this.status = 'success';
          localStorage.setItem('identity', JSON.stringify(this.user));
          console.log(this.user.image);
          this.identity = this.user;
          // SUBIDA DE IMAGENES
          this.uploadService.makeFileRequest(this.url + 'upload-image-user/' + this.user._id, [], this.filesToUpload, this.token, 'image')
            .then((result: any) => {
              console.log(result);
              this.user.image = result.user.image;
              localStorage.setItem('identity', JSON.stringify(this.user));
            }).catch(error => {
              this.status = 'error';
              console.log(error);
            });
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
  fileChangeEvent(fileInput: any) {
    this.filesToUpload = (fileInput.target.files as Array<File>);
    console.log(this.filesToUpload);
  }
}
