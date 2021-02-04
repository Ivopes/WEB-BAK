import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMPTY } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DbxJson } from '../shared/models/dbxJson.model';
import { AuthService } from '../shared/services/auth.service';
import { SnackBarService } from '../shared/services/snackBar.service';

@Component({
  selector: 'app-main-dbx-auth',
  templateUrl: './main-dbx-auth.component.html',
  styleUrls: ['./main-dbx-auth.component.scss']
})
export class MainDbxAuthComponent implements OnInit {

  private dbxCode: string = null;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private snack: SnackBarService
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap
    .pipe(
      switchMap(params => {
        this.dbxCode = params.get('code');
        console.log('prvni');
        return this.dbxCode !== null ? this.authService.getDropboxCodeHashed() : EMPTY;
      })).pipe(
        switchMap(hashKeys => {
          console.log('druha');
          console.log(hashKeys);
          return this.authService.dropboxOAuth(this.dbxCode, hashKeys);
        }))
        .pipe(
          switchMap(dbxData => {
            console.log('posledni');
            console.log(dbxData);
            const dbxJson: DbxJson = {
              cursor: '',
              dropboxId: dbxData.account_id,
              jwtToken: dbxData.access_token
            };

            return this.authService.saveDropboxJwt(dbxJson);
          })).subscribe(() => {},
          err => this.snack.showSnackBar('Oops! Something went wrong, please try again later', 'Close', 5000)
          );
  }
}
