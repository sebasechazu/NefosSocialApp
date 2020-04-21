import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UsersComponent } from './components/users/users.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileTimelineComponent } from './components/profile/profile-timeline/profile-timeline.component';
import { ProfileFollowingComponent } from './components/profile/profile-following/profile-following.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegisterComponent },
  { path: 'mis-datos', component: UserEditComponent },
   { path: 'gente', component: UsersComponent },
  {
    path: 'perfil/:id', component: ProfileComponent, children: [
      { path: '', component: ProfileTimelineComponent },
      { path: 'timeline', component: ProfileTimelineComponent },
      { path: 'seguidores', component: ProfileFollowingComponent }]
  },
  { path: 'gente/:page', component: UsersComponent },
  { path: '**', component: HomeComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
