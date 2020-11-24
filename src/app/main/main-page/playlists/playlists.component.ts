import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter, switchMap } from 'rxjs/operators';
import { Playlist } from '../../shared/models/playlist.model';
import { PlaylistService } from '../../shared/services/playlist.service';
import { AddPlaylistDialogComponent } from './add-playlist-dialog/add-playlist-dialog.component';
import { SnackBarService } from '../../shared/services/snackBar.service';
import { DeleteDialogComponent } from '../../shared/components/dialogs/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss']
})
export class PlaylistsComponent implements OnInit {

  playlists: Playlist[] = [];

  constructor(
    private playlistService: PlaylistService,
    private matDialog: MatDialog,
    private snackBarService: SnackBarService
  ) { }

  ngOnInit(): void {
    this.playlistService.GetAll().subscribe(data => {
      this.playlists = data;
    });
  }
  addPlaylist(): void {
    const dialogRef = this.matDialog.open(AddPlaylistDialogComponent);

    dialogRef.afterClosed().pipe(
      filter(res => res),
      switchMap(res => this.playlistService.Post(res))
      ).subscribe(data => this.snackBarService.showSnackBar('Playlist was added', 'Close', 3000),
        err => this.snackBarService.showSnackBar('Oops! Something went wrong, please try again later', 'Close', 5000)
      );
  }
  showInfo(playlist: Playlist): void {
    console.log(playlist.name);
  }
  deletePlaylist(): void {
    const dialogRef = this.matDialog.open(DeleteDialogComponent);

    dialogRef.afterClosed().pipe(
      filter(res => res)
    ).subscribe(() => {
      // TODO fill delete logic
      console.log('delete');
    });
  }
}
