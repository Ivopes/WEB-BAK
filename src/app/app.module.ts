import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPrototypeComponent } from './prototype/main-prototype/main-prototype.component';
import { HttpClientModule } from '@angular/common/http';
import { MainLoginComponent } from './main/main-login/main-login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './main/shared/modules/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { JwtModule } from '@auth0/angular-jwt';
import { LoginComponent } from './main/main-login/login/login.component';
import { RegisterComponent } from './main/main-login/register/register.component';
import { MainPageComponent } from './main/main-page/main-page.component';
import { SongsComponent } from './main/main-page/songs/songs.component';
import { PlaylistsComponent } from './main/main-page/playlists/playlists.component';

export function tokenGetter(): string {
  return localStorage.getItem('jwt');
}

@NgModule({
  declarations: [
    AppComponent,
    MainPrototypeComponent,
    MainLoginComponent,
    LoginComponent,
    RegisterComponent,
    MainPageComponent,
    SongsComponent,
    PlaylistsComponent,
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
        allowedDomains: ['localhost:44303',
                         'garmusic.azurewebsites.net'],
        disallowedRoutes: [],
      },
    }),
    FlexLayoutModule,
  ],
  exports: [
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
