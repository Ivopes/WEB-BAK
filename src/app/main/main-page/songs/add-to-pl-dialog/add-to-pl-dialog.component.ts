import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Playlist } from '../../../shared/models/playlist.model';
import { PlaylistSong } from '../../../shared/models/playlistSong.model';
import { Song } from '../../../shared/models/song.model';
import { PlaylistService } from '../../../shared/services/playlist.service';

@Component({
  selector: 'app-add-to-pl-dialog',
  templateUrl: './add-to-pl-dialog.component.html',
  styleUrls: ['./add-to-pl-dialog.component.scss']
})
export class AddToPlDialogComponent implements OnInit {

  playlists: Playlist[];
  song: Song;
  checked: boolean[]  = [];

  @Output() addPlaylist = new EventEmitter<number>();
  @Output() removePlaylist = new EventEmitter<number>();

  constructor(
    public dialogRef: MatDialogRef<AddToPlDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      song: Song
    },
    private playlistService: PlaylistService
  ) { }

  ngOnInit(): void {
    this.playlistService.GetAll().subscribe(data => {
      this.playlists = data;
      this.checkPlaylists();
    });
  }
  checkPlaylists(): void {
    for (const pl of this.playlists) {
      let i = 0;
      for (const pl2 of this.data.song.playlists) {
        if (pl.id === pl2.id) {
          this.checked.push(true);
          break;
        }
        if (++i === this.data.song.playlists.length) {
          this.checked.push(false);
        }
      }
    }
  }
  changeChecked(index: number): void {
    this.checked[index] = !this.checked[index];

    this.checked[index] ? this.addPlaylist.emit(this.playlists[index].id) : this.removePlaylist.emit(this.playlists[index].id);
  }
}
