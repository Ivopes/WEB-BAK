import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { SongService } from '../../shared/services/song.service';
import { SongStorageService } from '../../shared/services/song-storage.service';
import { Song } from '../../shared/models/song.model';
import { Route } from '@angular/compiler/src/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from '../../shared/services/snackBar.service';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss']
})
export class SongsComponent implements OnInit {

  songs: Song[] = [];

  fileToUpload: File = null;

  allowedExtensions: string[] = [
    '.mp3'
  ];

  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(
    private songService: SongService,
    private snackBarService: SnackBarService
  ) { }

  ngOnInit(): void {
    this.getData();
  }
  getData(): void {
    this.songService.getAll().subscribe(data => {
      this.songs = data;
    });
  }
  onFileSelected(files: FileList): void {
    this.fileToUpload = files.item(0);
  }
  postFile(): void {
    if (this.fileToUpload == null) {
      return;
    }

    const extension = this.fileToUpload.name.substring(this.fileToUpload.name.lastIndexOf('.'));

    if (!this.allowedExtensions.includes(extension)) {
      this.snackBarService.showSnackBar('This format is not supported', 'Close', 5000);
      return;
    }

    this.songService.post(this.fileToUpload).subscribe(
      data => {
        this.snackBarService.showSnackBar('File uploaded succesfully', 'Close', 3000);
        this.getData();
        this.resetFileInput();
      },
      err => {
        this.snackBarService.showSnackBar(err.error, 'Close', 5000);
        this.resetFileInput();
      });
  }

  resetFileInput(): void {
    this.fileToUpload = null;
    this.fileInput.nativeElement.value = '';
  }
}
