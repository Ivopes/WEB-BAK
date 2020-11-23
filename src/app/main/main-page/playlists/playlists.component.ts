import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter, switchMap } from 'rxjs/operators';
import { Playlist } from '../../shared/models/playlist.model';
import { PlaylistService } from '../../shared/services/playlist.service';
import { AddPlaylistDialogComponent } from './add-playlist-dialog/add-playlist-dialog.component';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss']
})
export class PlaylistsComponent implements OnInit {

  playlists: Playlist[] = [];

  constructor(
    private playlistService: PlaylistService,
    private matDialog: MatDialog
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
      ).subscribe(data => {
        console.log(data);
      });
  }
  showInfo(playlist: Playlist): void {
    console.log(playlist.name);
  }
}
