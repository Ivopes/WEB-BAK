import { Component, OnInit } from '@angular/core';
import { Mp3Service } from '../../shared/services/mp3.service';
import { Mp3StorageService } from '../../shared/services/mp3-storage.service';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss']
})
export class SongsComponent implements OnInit {

  constructor(
    private mp3Service: Mp3Service,
    private mp3StorageService: Mp3StorageService
  ) { }

  fileNames: string[] = [];

  fileToUpload = null;

  ngOnInit(): void {
    this.mp3Service.getAll().subscribe(data => {
      this.fileNames = data;
    });
  }
  getData(): void {
    this.fileNames = this.mp3StorageService.getAll();
  }
  onFileSelected(files: FileList): void {
    console.log(files);
    this.fileToUpload = files.item(0);
  }
  postFile(): void {
    if (this.fileToUpload !== null) {
        this.mp3Service.post(this.fileToUpload).subscribe(data => {
          if (data === true) {
            this.getData();
          }
        },
        err => console.log(err));
      }
    }
}
