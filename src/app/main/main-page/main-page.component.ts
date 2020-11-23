import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { EMPTY, observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { DbxJson } from '../shared/models/dbxJson.model';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  openSideNav = false;
  showMain = true;

  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.showMainGuard();

    this.readJwtCodeFromUrl();

    //this.getDropboxJwt();
  }
  /*getDropboxJwt(): void {
    this.authService.getDropboxJwt().subscribe(data => {
      localStorage.setItem('jwt-dropbox', data.token);
    });
  }*/
  logout(): void {
    localStorage.removeItem('jwt');
    this.router.navigate(['/login']);
  }
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
  private showMainGuard(): void {
    if (this.router.url === '/') {
      this.showMain = true;
    } else {
      this.showMain = false;
    }
    this.router.events.pipe(
      filter(url => url instanceof NavigationEnd)
    ).subscribe((url: NavigationEnd) => {
      if (url.urlAfterRedirects === '/') {
        this.showMain = true;
      } else {
        this.showMain = false;
      }
    });
  }
}
