import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MomentModule } from 'angular2-moment';
// -------------------------------------------------------------------------------------------------
// MODULO CUSTOM
// -------------------------------------------------------------------------------------------------
import { MessagesModule } from './messages/messages.module';
// -------------------------------------------------------------------------------------------------
// SERVICIOS
// -------------------------------------------------------------------------------------------------
import { ProfileService } from './services/profile.service';
import { UserService } from './services/user.service';
import { FollowService } from './services/follow.service';
import { PublicationService } from './services/publication.service';
import { HomeService } from './services/home.service';
import { UploadService } from './services/upload.service';
// -------------------------------------------------------------------------------------------------
// COMPONENTES
// -------------------------------------------------------------------------------------------------
// LOGIN
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
// HOME
import { HomeComponent } from './components/home/home.component';
import { HomeProfileComponent } from './components/home/home-profile/home-profile.component';
import { HomePublicationsComponent } from './components/home/home-publications/home-publications.component';
// HEADER
import { HeaderComponent } from './components/header/header.component';
// PROFILE
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileFollowingComponent } from './components/profile/profile-contacts/profile-following/profile-following.component';
import { UserPublicationsComponent } from './components/profile/profile-timeline/user-publications/user-publications.component';
import { AboutAuthorComponent } from './components/profile/profile-timeline/about-author/about-author.component';
import { ProfileTimelineComponent } from './components/profile/profile-timeline/profile-timeline.component';
import { ProfileContacsComponent } from './components/profile/profile-contacts/profile-contacs.component';
// USERS
import { UsersComponent } from './components/users/users.component';
// SHARED
import { SharePublicationComponent } from './components/shared/share-publication/share-publication.component';
import { UserCardComponent } from './components/shared/user-card/user-card.component';
import { RecommendedUsersComponent } from './components/shared/recommended-users/recommended-users.component';

// -----------------------------------------------------------------------------------------------
import { UserFollowingComponent } from './components/user-following/user-following.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { ProfileFollowedComponent } from './components/profile/profile-contacts/profile-followed/profile-followed.component';
import { MessageService } from './services/message.service';
// -----------------------------------------------------------------------------------------------

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    UserEditComponent,
    UsersComponent,
    HomeProfileComponent,
    SharePublicationComponent,
    HomePublicationsComponent,
    UserPublicationsComponent,
    UserFollowingComponent,
    ProfileComponent,
    ProfileTimelineComponent,
    ProfileContacsComponent,
    AboutAuthorComponent,
    RecommendedUsersComponent,
    ProfileFollowingComponent,
    UserCardComponent,
    ProfileFollowedComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    MomentModule,
    MessagesModule
  ],
  providers: [
    ProfileService,
    HomeService,
    UserService,
    FollowService,
    PublicationService,
    UploadService,
    MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
