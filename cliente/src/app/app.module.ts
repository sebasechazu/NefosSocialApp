import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MomentModule } from 'angular2-moment';
import { HelperService } from './services/helper.service';
// -------------------------------------------------------------------------------------------------
// COMPONENTES
// -------------------------------------------------------------------------------------------------
import { NavbarComponent } from './components/shared/navbar/navbar.component';
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


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    UserEditComponent,
    UsersComponent,
    UserProfileComponent,
    ProfileBannerComponent,
    RecommendedUsersComponent,
    SharePublicationComponent,
    PublicationsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    MomentModule
  ],
  providers: [HelperService],
  bootstrap: [AppComponent]
})
export class AppModule { }
