import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLoginComponent } from './main/main-login/main-login.component';
import { AuthGuard } from './main/shared/services/auth-guard.service';
import { MainPageComponent } from './main/main-page/main-page.component';
import { SongsComponent } from './main/main-page/songs/songs.component';
import { PlaylistsComponent } from './main/main-page/playlists/playlists.component';
import { ProfileComponent } from './main/main-page/profile/profile.component';
import { PlaylistDetailComponent } from './main/main-page/playlists/playlist-detail/playlist-detail.component';
import { MainDbxAuthComponent } from './main/main-dbx-auth/main-dbx-auth.component';
import { MainGdAuthComponent } from './main/main-gd-auth/main-gd-auth.component';

const routes: Routes = [
  { path: 'login', component: MainLoginComponent},
  { path: 'login/watch', component: MainLoginComponent},
  { path: 'login/watch/code', component: MainLoginComponent},
  { path: '', component: MainPageComponent, canActivate: [AuthGuard] ,
      children: [
        {
          path: 'songs', component: SongsComponent
        },
        {
          path: 'playlists/:id', component: PlaylistDetailComponent
        },
        {
          path: 'playlists', component: PlaylistsComponent
        },
        {
          path: 'profile', component: ProfileComponent
        },
        {
          path: 'dbx', component: MainDbxAuthComponent
        },
        {
          path: 'gd', component: MainGdAuthComponent
        }
      ]},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
