import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../shared/services/auth.service';
import { LoadingService } from '../shared/services/loading.service';
import { SnackBarService } from '../shared/services/snackBar.service';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-main-gd-auth',
  templateUrl: './main-gd-auth.component.html',
  styleUrls: ['./main-gd-auth.component.scss']
})
export class MainGdAuthComponent implements OnInit, OnDestroy {

  private gdCode: string = null;

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

        this.gdCode = params.get('code');

        return this.gdCode !== null ? this.authService.GoogleDriveAuth(this.gdCode) : EMPTY;
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
