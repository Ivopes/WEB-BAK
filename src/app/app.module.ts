import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HttpRequest } from '@angular/common/http';
import { MainLoginComponent } from './main/main-login/main-login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './main/shared/modules/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';

import { JwtModule } from '@auth0/angular-jwt';
import { LoginComponent } from './main/main-login/login/login.component';
import { RegisterComponent } from './main/main-login/register/register.component';
import { MainPageComponent } from './main/main-page/main-page.component';
import { SongsComponent } from './main/main-page/songs/songs.component';
import { PlaylistsComponent } from './main/main-page/playlists/playlists.component';
import { FileCardComponent } from './main/shared/components/file-card/file-card.component';
import { ProfileComponent } from './main/main-page/profile/profile.component';
import { AddPlaylistDialogComponent } from './main/main-page/playlists/add-playlist-dialog/add-playlist-dialog.component';
import { DeleteDialogComponent } from './main/shared/components/dialogs/delete-dialog/delete-dialog.component';
import { AddToPlDialogComponent } from './main/main-page/songs/add-to-pl-dialog/add-to-pl-dialog.component';
import { PlaylistDetailComponent } from './main/main-page/playlists/playlist-detail/playlist-detail.component';
import { MainDbxAuthComponent } from './main/main-dbx-auth/main-dbx-auth.component';
import { AddSongsToPlDialogComponent } from './main/main-page/playlists/playlist-detail/add-songs-to-pl-dialog/add-songs-to-pl-dialog.component';


export function tokenGetter(request: HttpRequest<any>): string {
  if (request.url.includes('dropbox')) {
    return localStorage.getItem('jwt-dropbox');
  }
  return localStorage.getItem('jwt');
}

@NgModule({
  declarations: [
    AppComponent,
    MainLoginComponent,
    LoginComponent,
    RegisterComponent,
    MainPageComponent,
    SongsComponent,
    PlaylistsComponent,
    FileCardComponent,
    ProfileComponent,
    AddPlaylistDialogComponent,
    DeleteDialogComponent,
    AddToPlDialogComponent,
    PlaylistDetailComponent,
    MainDbxAuthComponent,
    AddSongsToPlDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: [ 'localhost:44303',
                          'garmusic.azurewebsites.net',
                          'api.dropboxapi.com'],
        disallowedRoutes: [],
      },
    }),
    FlexLayoutModule,
    FormsModule,
  ],
  exports: [
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
