import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MomentModule } from 'angular2-moment';
// -------------------------------------------------------------------------------------------------
// SERVICIOS
// -------------------------------------------------------------------------------------------------
import { ProfileService } from './services/profile.service';
// -------------------------------------------------------------------------------------------------
// COMPONENTES
// -------------------------------------------------------------------------------------------------
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UsersComponent } from './components/users/users.component';
import { ProfileBannerComponent } from './components/home/profile-banner/profile-banner.component';
import { SharePublicationComponent } from './components/shared/share-publication/share-publication.component';
import { PublicationsComponent } from './components/home/publications/publications.component';
import { UserPublicationsComponent } from './components/profile/profile-timeline/user-publications/user-publications.component';
import { UserFollowingComponent } from './components/user-following/user-following.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileTimelineComponent } from './components/profile/profile-timeline/profile-timeline.component';
import { ProfileFollowingComponent } from './components/profile/profile-following/profile-following.component';
import { AboutAuthorComponent } from './components/profile/profile-timeline/about-author/about-author.component';
import { RecommendedUsersComponent } from './components/profile/profile-timeline/recommended-users/recommended-users.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    UserEditComponent,
    UsersComponent,
    ProfileBannerComponent,
    SharePublicationComponent,
    PublicationsComponent,
    UserPublicationsComponent,
    UserFollowingComponent,
    ProfileComponent,
    ProfileTimelineComponent,
    ProfileFollowingComponent,
    AboutAuthorComponent,
    RecommendedUsersComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    MomentModule
  ],
  providers: [ProfileService],
  bootstrap: [AppComponent]
})
export class AppModule { }
