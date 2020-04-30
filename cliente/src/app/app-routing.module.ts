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


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegisterComponent },
  { path: 'mis-datos', component: UserEditComponent },
  { path: 'usuarios', component: UsersComponent },
  {
    path: 'perfil/:id', component: ProfileComponent,
    children: [
      { path: '', component: ProfileTimelineComponent },
      { path: 'timeline', component: ProfileTimelineComponent },
      {
        path: 'contactos', component: ProfileContacsComponent,
        children: [
          { path: '', component: ProfileFollowingComponent },
          { path: 'Siguiendo', component: ProfileFollowingComponent },
          { path: 'Seguidores', component: ProfileFollowedComponent }
        ]
      }
    ]
  },
  { path: 'gente/:page', component: UsersComponent },
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
