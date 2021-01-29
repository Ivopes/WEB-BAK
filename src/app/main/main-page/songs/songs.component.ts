import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { SongService } from '../../shared/services/song.service';
import { SongStorageService } from '../../shared/services/song-storage.service';
import { Song } from '../../shared/models/song.model';
import { Route } from '@angular/compiler/src/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from '../../shared/services/snackBar.service';
import { MatDialog } from '@angular/material/dialog';
import { AddToPlDialogComponent } from './add-to-pl-dialog/add-to-pl-dialog.component';
import { filter, map, share, switchMap, tap } from 'rxjs/operators';
import { DeleteDialogComponent } from '../../shared/components/dialogs/delete-dialog/delete-dialog.component';
import { PlaylistSong } from '../../shared/models/playlistSong.model';
import { PlaylistService } from '../../shared/services/playlist.service';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss']
})
export class SongsComponent implements OnInit {

  songs: Song[] = [];

  fileToUpload: File = null;

  displayedColumns = ['select', 'name', 'download', 'addToPl', 'remove'];

  allowedExtensions: string[] = [
    '.mp3'
  ];

  dataSource: MatTableDataSource<Song>;

  selection: SelectionModel<Song>;

  checked = false;

  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(
    private songService: SongService,
    private snackBarService: SnackBarService,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.selection = new SelectionModel<Song>(true);

    this.getData();
  }
  getData(): void {
    this.songService.getAll().subscribe(data => {
      this.songs = data;
      this.dataSource = new MatTableDataSource(data);
    });
  }
  onFileSelected(files: FileList): void {
    this.fileToUpload = files.item(0);
  }
  postFile(): void {
    if (this.fileToUpload == null) {
      return;
    }

    // extension format check
    const extension = this.fileToUpload.name.substring(this.fileToUpload.name.lastIndexOf('.'));

    if (!this.allowedExtensions.includes(extension)) {
      this.snackBarService.showSnackBar('This format is not supported', 'Close', 5000);
      return;
    }

    // post a file
    this.songService.post(this.fileToUpload).subscribe(
      data => {
        this.songService.addToData(data);
        this.snackBarService.showSnackBar('File uploaded succesfully', 'Close', 3000);
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
  addOrRemoveToPlaylist(sIndex: number): void {
    const dialogRef = this.matDialog.open(AddToPlDialogComponent,
      {
        data: {
          song: this.songs[sIndex]
        }
      });

    // subscribe to adding playlist to song
    dialogRef.componentInstance.addPlaylist.pipe(
      switchMap(pId => {
        return this.songService.addPlaylistToSong(this.songs[sIndex].id, pId);
      })
    ).subscribe(
      () => this.snackBarService.showSnackBar('Playlist was changed', 'Close', 2000),
      err => this.snackBarService.showSnackBar('Oops! Something went wrong, please try again later', 'Close', 3000)
    );

    // subscribe to removing playlist to song
    dialogRef.componentInstance.removePlaylist.pipe(
      switchMap(pId => {
        return this.songService.removePlaylist(this.songs[sIndex].id, pId);
      })
    ).subscribe(
      () => this.snackBarService.showSnackBar('Playlist was changed', 'Close', 2000),
      err => this.snackBarService.showSnackBar('Oops! Something went wrong, please try again later', 'Close', 3000)
    );
  }
  // dialog for deleting song
  deleteSong(index: number): void {
    const dialogRef = this.matDialog.open(DeleteDialogComponent);

    dialogRef.afterClosed().pipe(
      filter(res => res),
      switchMap(res => this.songService.remove(this.songs[index].id))
    ).subscribe(
      () => this.snackBarService.showSnackBar('Song was deleted', 'Close', 2000),
      err => this.snackBarService.showSnackBar('Oops! Something went wrong, please try again later', 'Close', 3000)
    );
  }
  downloadSong(index: number): void {
    const fileName = this.songs[index].name;

    this.songService.getFile(this.songs[index].id).subscribe(file => {
      const blob = new Blob([file], { type: file.type });
      const url = window.URL.createObjectURL(file);
      const anchor = document.createElement('a');
      anchor.download = fileName;
      anchor.href = url;
      anchor.click();
      anchor.remove();
    });
  }
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }
}
