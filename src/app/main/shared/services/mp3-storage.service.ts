import { Injectable } from '@angular/core';
import { Mp3Service } from './mp3.service';

@Injectable({providedIn: 'root'})
export class Mp3StorageService {
  constructor(
    private mp3Service: Mp3Service
  ) { }

  private fileNames: string[] = [];
  public requested = false;

  public add(item: string): void {
    this.fileNames.push(item);
  }
  public getAll(): string[] {
    console.log(this.requested);
    if (!this.requested) {
      this.mp3Service.getAll().subscribe(data => {
        this.fileNames = data;
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
