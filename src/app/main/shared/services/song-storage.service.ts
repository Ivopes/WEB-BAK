import { Injectable } from '@angular/core';
import { SongService } from './song.service';

@Injectable({providedIn: 'root'})
export class SongStorageService {
  constructor(
    private songService: SongService
  ) { }

  private fileNames: string[] = [];
  public requested = false;

  public add(item: string): void {
    this.fileNames.push(item);
  }
  public getAll(): string[] {
    console.log(this.requested);
    if (!this.requested) {
      this.songService.getAll().subscribe(data => {
        //this.fileNames = data;
        this.requested = true;
      }, err => this.fileNames = []);
    }
    return this.fileNames;
  }
  public getNewAll(): string[] {
    this.requested = false;
    return this.getAll();
  }
  public getClean(): string[] {
    this.fileNames = [];
    return this.fileNames;
  }
}
