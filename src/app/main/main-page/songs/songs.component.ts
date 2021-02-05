import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { SongService } from '../../shared/services/song.service';
import { SongStorageService } from '../../shared/services/song-storage.service';
import { Song } from '../../shared/models/song.model';
import { Route } from '@angular/compiler/src/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from '../../shared/services/snackBar.service';
import { MatDialog } from '@angular/material/dialog';
import { AddToPlDialogComponent } from './add-to-pl-dialog/add-to-pl-dialog.component';
import { delay, filter, map, share, switchMap, tap } from 'rxjs/operators';
import { DeleteDialogComponent } from '../../shared/components/dialogs/delete-dialog/delete-dialog.component';
import { PlaylistSong } from '../../shared/models/playlistSong.model';
import { PlaylistService } from '../../shared/services/playlist.service';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { of } from 'rxjs';
import { LoadingService } from '../../shared/services/loading.service';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss']
})
export class SongsComponent implements OnInit, AfterViewInit{

  songs: Song[];

  fileToUpload: File = null;

  displayedColumns = ['select', 'name', 'download', 'addToPl', 'remove'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

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
    private matDialog: MatDialog,
    private loadingService: LoadingService
  ) { }
  ngAfterViewInit(): void {
    this.loadingService.startLoading();
    this.getData();
  }

  ngOnInit(): void {
    this.selection = new SelectionModel<Song>(true);
  }
  getData(): void {
    this.songService.getAll().subscribe(data => {
      this.songs = data;
      this.dataSource = new MatTableDataSource(this.songs);
      this.dataSource.paginator = this.paginator;
      this.loadingService.stopLoading();
    });
  }
  onFileSelected(files: FileList): void {
    this.fileToUpload = files.item(0);
  }
  /**
   * uploads file to backend
   */
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

    // Show loading
    this.loadingService.startLoading();

    const file = this.fileToUpload;

    // Disable and reset input
    this.resetFileInput();

    // post a file
    this.songService.post(file).subscribe(
      data => {
        this.songService.addToData(data);
        this.dataSource.data = this.dataSource.data;
        this.loadingService.stopLoading();
        this.snackBarService.showSnackBar('File uploaded succesfully', 'Close', 3000);
        this.resetFileInput();
      },
      err => {
        this.snackBarService.showSnackBar(err.error, 'Close', 5000);
        this.resetFileInput();
        this.loadingService.stopLoading();
      });
  }
  resetFileInput(): void {
    this.fileToUpload = null;
    this.fileInput.nativeElement.value = '';
  }
  addOrRemoveToPlaylist(song: Song): void {
    const dialogRef = this.matDialog.open(AddToPlDialogComponent,
      {
        data: {
          song
        }
      });

    // subscribe to adding playlist to song
    dialogRef.componentInstance.addPlaylist.pipe(
      switchMap(pId => {
        return this.songService.addPlaylistToSong(song.id, pId);
      })
    ).subscribe(
      () => this.snackBarService.showSnackBar('Playlist was changed', 'Close', 2000),
      err => this.snackBarService.showSnackBar('Oops! Something went wrong, please try again later', 'Close', 3000)
    );

    // subscribe to removing playlist to song
    dialogRef.componentInstance.removePlaylist.pipe(
      switchMap(pId => {
        return this.songService.removePlaylist(song.id, pId);
      })
    ).subscribe(
      () => this.snackBarService.showSnackBar('Playlist was changed', 'Close', 2000),
      err => this.snackBarService.showSnackBar('Oops! Something went wrong, please try again later', 'Close', 3000)
    );
  }
  /**
   * Deletes song from storage and database
   * @param song song to delete
   */
  deleteSong(song: Song): void {
    const dialogRef = this.matDialog.open(DeleteDialogComponent);

    dialogRef.afterClosed().pipe(
      filter(res => res),
      switchMap(res => {
        this.loadingService.startLoading();
        return this.songService.remove(song.id);
      })
    ).subscribe(() => {
        this.loadingService.stopLoading();
        this.snackBarService.showSnackBar('Song was deleted', 'Close', 2000);
        this.dataSource.data = this.dataSource.data;
        this.selection.clear();
      },
      err => {
        this.loadingService.stopLoading();
        this.snackBarService.showSnackBar('Oops! Something went wrong, please try again later', 'Close', 3000);
        this.selection.clear();
      }
    );
  }
  /**
   * Download song from storage for user
   * @param song song to download
   */
  downloadSong(song: Song): void {
    const fileName = song.name;
    this.loadingService.startLoading();
    this.songService.getFile(song.id).subscribe(file => {
      this.loadingService.stopLoading();
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
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  deleteRange(): void {
    console.log(this.selection.selected.map(s => s.id));

    this.loadingService.startLoading();

    this.songService.removeRange(this.selection.selected.map(s => s.id)).subscribe(() => {
      this.loadingService.stopLoading();
      this.snackBarService.showSnackBar('Songs were deleted', 'Close', 2000);
      this.selection.clear();
      this.dataSource.data = this.dataSource.data;
    },
    err => {
      this.loadingService.stopLoading();
      this.snackBarService.showSnackBar('Oops! Something went wrong, please try again later', 'Close', 3000);
    });
  }
}
