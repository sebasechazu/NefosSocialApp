import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MomentModule } from 'angular2-moment';
// -------------------------------------------------------------------------------------------------
// COMPONENTES
// -------------------------------------------------------------------------------------------------
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UsersComponent } from './components/users/users.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ProfileBannerComponent } from './components/widgets/profile-banner/profile-banner.component';
import { RecommendedUsersComponent } from './components/widgets/recommended-users/recommended-users.component';
import { SharePublicationComponent } from './components/widgets/share-publication/share-publication.component';
import { PublicationsComponent } from './components/widgets/publications/publications.component';
import { UserPublicationsComponent } from './components/user-publications/user-publications.component';
import { UserFollowingComponent } from './components/user-following/user-following.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    UserEditComponent,
    UsersComponent,
    UserProfileComponent,
    ProfileBannerComponent,
    RecommendedUsersComponent,
    SharePublicationComponent,
    PublicationsComponent,
    UserPublicationsComponent,
    UserFollowingComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    MomentModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
