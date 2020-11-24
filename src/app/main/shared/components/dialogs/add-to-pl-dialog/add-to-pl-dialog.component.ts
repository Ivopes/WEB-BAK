import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AddPlaylistDialogComponent } from 'src/app/main/main-page/playlists/add-playlist-dialog/add-playlist-dialog.component';
import { Playlist } from '../../../models/playlist.model';
import { PlaylistService } from '../../../services/playlist.service';

@Component({
  selector: 'app-add-to-pl-dialog',
  templateUrl: './add-to-pl-dialog.component.html',
  styleUrls: ['./add-to-pl-dialog.component.scss']
})
export class AddToPlDialogComponent implements OnInit {

  playlists: Playlist[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddPlaylistDialogComponent>,
    private playlistService: PlaylistService
  ) { }

  ngOnInit(): void {
    this.playlistService.GetAll().subscribe(data => {
      this.playlists = data;
    });
  }
}
