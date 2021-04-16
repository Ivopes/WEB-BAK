import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { DbxJson } from '../shared/models/dbxJson.model';
import { AuthService } from '../shared/services/auth.service';
import { LoadingService } from '../shared/services/loading.service';
import { SnackBarService } from '../shared/services/snackBar.service';

@Component({
  selector: 'app-main-dbx-auth',
  templateUrl: './main-dbx-auth.component.html',
  styleUrls: ['./main-dbx-auth.component.scss']
})
export class MainDbxAuthComponent implements OnInit, OnDestroy {

  private dbxCode: string = null;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private snack: SnackBarService,
    private router: Router,
    private loadingService: LoadingService
  ) { }
  ngOnDestroy(): void {
    this.loadingService.addStopLoading();
  }

  ngOnInit(): void {
    this.loadingService.addStartLoading();

    this.route.queryParamMap
    .pipe(
      switchMap(params => {
        this.dbxCode = params.get('code');
        return this.dbxCode !== null ? this.authService.dropboxOAuth(this.dbxCode) : EMPTY;
      })).subscribe(() => {
          this.snack.showSnackBar('Storage was added succesfully', 'Close', 5000);
          this.router.navigate(['playlists']);
        },
          err => {
            this.snack.showSnackBar('Oops! Something went wrong, please try again later', 'Close', 5000);
            this.router.navigate(['playlists']);
          }
        );
  }
}
