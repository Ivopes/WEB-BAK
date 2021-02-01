import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { EMPTY, observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { DbxJson } from '../shared/models/dbxJson.model';
import { AuthService } from '../shared/services/auth.service';
import { PlaylistService } from '../shared/services/playlist.service';
import { SongService } from '../shared/services/song.service';
import { AccountService } from '../shared/services/account.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  openSideNav = false;
  showMain = true;

  isSmallScreen;

  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private songService: SongService,
    private playlistService: PlaylistService,
    private breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit(): void {
    this.redirectCheck();
    this.isSmallScreen = this.breakpointObserver.observe(Breakpoints.XSmall);

    // TODO: move to main-dbx-auth component
    // this.readJwtCodeFromUrl();

  }
  /**
   * delete token from storage and and redirect user to login
   */
  logout(): void {
    localStorage.removeItem('jwt');
    this.songService.clearData();
    this.playlistService.clearData();
    this.router.navigate(['/login']);
  }
  /**
   * reads jwt token from url - used for dropbox auth
   */
  private readJwtCodeFromUrl(): void {
    this.route.queryParamMap
    .pipe(
      switchMap(params => {
        const code = params.get('code');
        return code != null ? this.authService.dropboxOAuth(code) : EMPTY;
      }))
      .pipe(
        switchMap(data => {
          const token = data.access_token;
          const id = data.account_id;
          localStorage.setItem('jwt-dropbox', token);
          const dbxJson: DbxJson = {
            cursor: '',
            dropboxId: data.account_id,
            jwtToken: token
          };
          return this.authService.saveDropboxJwt(dbxJson);
        })
      )
      .subscribe(() => {
      });
  }
  /**
   * redirect to playlists if needed
   */
  private redirectCheck(): void {
    if (this.router.url === '/') {
      this.showMain = true;
      this.router.navigate(['/playlists']);
    }
  }

  toMain(): void {
    this.router.navigate(['/']);
  }
}
