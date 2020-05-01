import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UsersComponent } from './components/users/users.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileTimelineComponent } from './components/profile/profile-timeline/profile-timeline.component';
import { ProfileContacsComponent } from './components/profile/profile-contacts/profile-contacs.component';
import { ProfileFollowingComponent } from './components/profile/profile-contacts/profile-following/profile-following.component';
import { ProfileFollowedComponent } from './components/profile/profile-contacts/profile-followed/profile-followed.component';
import { UserGuard } from './services/user.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent, canActivate: [UserGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegisterComponent },
  { path: 'mis-datos', component: UserEditComponent, canActivate: [UserGuard] },
  { path: 'usuarios', component: UsersComponent, canActivate: [UserGuard] },
  {
    path: 'perfil/:id', component: ProfileComponent, canActivate: [UserGuard],
    children: [
      { path: '', component: ProfileTimelineComponent, canActivate: [UserGuard]  },
      { path: 'timeline', component: ProfileTimelineComponent, canActivate: [UserGuard]  },
      {
        path: 'contactos', component: ProfileContacsComponent, canActivate: [UserGuard] ,
        children: [
          { path: '', component: ProfileFollowingComponent, canActivate: [UserGuard]  },
          { path: 'Siguiendo', component: ProfileFollowingComponent, canActivate: [UserGuard]  },
          { path: 'Seguidores', component: ProfileFollowedComponent, canActivate: [UserGuard] }
        ]
      }
    ]
  },
  { path: 'gente/:page', component: UsersComponent, canActivate: [UserGuard]  },
  {
    path: 'mensajes', loadChildren: () =>
      import('./messages/messages.module').then(m => m.MessagesModule)
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
