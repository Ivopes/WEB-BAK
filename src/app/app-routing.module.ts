import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLoginComponent } from './main/main-login/main-login.component';
import { MainPrototypeComponent } from './prototype/main-prototype/main-prototype.component';
import { AuthGuard } from './main/shared/services/auth-guard.service';
import { MainPageComponent } from './main/main-page/main-page.component';
import { SongsComponent } from './main/main-page/songs/songs.component';
import { PlaylistsComponent } from './main/main-page/playlists/playlists.component';

const routes: Routes = [
  { path: 'login', component: MainLoginComponent},
  { path: 'test', component: MainPrototypeComponent, canActivate: [AuthGuard]},
  { path: '', component: MainPageComponent, canActivate: [AuthGuard] ,
      children: [
        {
          path: 'songs', component: SongsComponent
        },
        {
          path: 'playlists', component: PlaylistsComponent
        }
      ]},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
