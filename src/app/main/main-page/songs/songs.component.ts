import { Component, OnInit } from '@angular/core';
import { SongService } from '../../shared/services/song.service';
import { SongStorageService } from '../../shared/services/song-storage.service';
import { Song } from '../../shared/models/song.model';
import { Route } from '@angular/compiler/src/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss']
})
export class SongsComponent implements OnInit {

  constructor(
    private songService: SongService
  ) { }

  songs: Song[] = [];

  fileToUpload = null;

  ngOnInit(): void {
    this.songService.getAll().subscribe(data => {
      this.songs = data;
    });
  }
  getData(): void {
    //this.songs = this.mp3StorageService.getAll();
  }
  onFileSelected(files: FileList): void {
    console.log(files);
    this.fileToUpload = files.item(0);
  }
  postFile(): void {
    if (this.fileToUpload !== null) {
        this.songService.post(this.fileToUpload).subscribe(data => {
          if (data === true) {
            this.getData();
          }
        },
        err => console.log(err));
      }
  }
}
