import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter, switchMap } from 'rxjs/operators';
import { Playlist } from '../../shared/models/playlist.model';
import { PlaylistService } from '../../shared/services/playlist.service';
import { AddPlaylistDialogComponent } from './add-playlist-dialog/add-playlist-dialog.component';
import { SnackBarService } from '../../shared/services/snackBar.service';
import { DeleteDialogComponent } from '../../shared/components/dialogs/delete-dialog/delete-dialog.component';
import { Router } from '@angular/router';
import { LoadingService } from '../../shared/services/loading.service';
import { EMPTY } from 'rxjs';
import { ScreenSizeService } from '../../shared/services/screenSize.service';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss']
})
export class PlaylistsComponent implements OnInit {

  playlists: Playlist[] = [];

  descSongsIndex = [0, 1, 2];

  constructor(
    private playlistService: PlaylistService,
    private matDialog: MatDialog,
    private snackBarService: SnackBarService,
    private router: Router,
    private loadingService: LoadingService,
    public screenSizeService: ScreenSizeService
  ) { }

  ngOnInit(): void {
    this.loadingService.startLoading();

    this.getData();
  }
  private getData(): void {
    this.playlistService.getAll().subscribe(data => {
      this.loadingService.stopLoading();
      this.playlists = data;
    });
  }

  addPlaylist(): void {
    const dialogRef = this.matDialog.open(AddPlaylistDialogComponent);
    let plToAdd = null;
    dialogRef.afterClosed().pipe(
      filter(res => res),
      switchMap(res => {
        this.loadingService.startLoading();
        plToAdd = res;
        return this.playlistService.post(res);
      })
      ).subscribe(
        () => {
          this.snackBarService.showSnackBar('Playlist was added', 'Close', 3000);

          this.playlistService.clearData();
          this.getData();

          this.loadingService.stopLoading();
        },
        err => {
          this.snackBarService.showSnackBar('Oops! Something went wrong, please try again later', 'Close', 5000);
          this.loadingService.stopLoading();
        }
      );
  }
  showInfo(pId: number): void {
    this.router.navigate(['/playlists', pId]);
  }
  deletePlaylist(id: number): void {
    const dialogRef = this.matDialog.open(DeleteDialogComponent);

    dialogRef.afterClosed().pipe(
      filter(res => res),
      switchMap(res => {
        this.loadingService.startLoading();

        return this.playlistService.remove(id);
      })
    ).subscribe(
      () => {
        this.snackBarService.showSnackBar('Playlist was deleted', 'Close', 3000);

        this.loadingService.stopLoading();
      },
      err => {
        this.snackBarService.showSnackBar('Oops! Something went wrong, please try again later', 'Close', 5000);
        this.loadingService.stopLoading();
      }
    );
  }
}
