import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SongService } from '../../shared/services/song.service';
import { Song } from '../../shared/models/song.model';
import { SnackBarService } from '../../shared/services/snackBar.service';
import { MatDialog } from '@angular/material/dialog';
import { AddToPlDialogComponent } from './add-to-pl-dialog/add-to-pl-dialog.component';
import { filter, first, switchMap } from 'rxjs/operators';
import { DeleteDialogComponent } from '../../shared/components/dialogs/delete-dialog/delete-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { LoadingService } from '../../shared/services/loading.service';
import { ScreenSizeService } from '../../shared/services/screenSize.service';
import { AccountService } from '../../shared/services/account.service';
import { Account } from '../../shared/models/account.model';
import { StorageService } from '../../shared/services/storage.service';
import { Storage } from '../../shared/models/storage.model';
import { ModifySongDataComponent } from './modify-song-data/modify-song-data.component';
import { EMPTY } from 'rxjs';
import { MatSelectChange } from '@angular/material/select';
import { PlaylistService } from '../../shared/services/playlist.service';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss']
})
export class SongsComponent implements OnInit, AfterViewInit {

  account: Account;

  selectedStorage = 'Google Drive';

  songs: Song[];
  fileToUpload: File = null;

  displayedColumns = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  allowedExtensions: string[] = [
    '.mp3'
  ];

  dataSource: MatTableDataSource<Song>;
  selection: SelectionModel<Song>;

  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(
    private songService: SongService,
    private snackBarService: SnackBarService,
    private matDialog: MatDialog,
    private loadingService: LoadingService,
    public screenSizeService: ScreenSizeService,
    private accountService: AccountService,
    public storageService: StorageService,
    private playlistService: PlaylistService
  ) { }
  ngAfterViewInit(): void {
    this.loadingService.addStartLoading();
    this.getData();
  }

  ngOnInit(): void {
    this.selection = new SelectionModel<Song>(true);

    this.screenSizeService.isSmallScreen().subscribe(data => {
      if (data.matches) {
        this.displayedColumns = ['select', 'name', 'options'];
      } else {
        this.displayedColumns = ['select', 'name', 'storage', 'author', 'length', 'download', 'addToPl', 'alterData', 'remove'];
      }
    });

    this.accountService.getById().subscribe(data => {
      this.account = data;
    });

    this.storageService.getSelectedStorage().subscribe(storage => {
      this.selectedStorage = storage.name;
    });
  }
  getData(): void {
    this.songService.getAll().subscribe(data => {
      this.songs = data;
      this.dataSource = new MatTableDataSource(this.songs);
      this.dataSource.paginator = this.paginator;

      // Connect paginator
      if (!this.paginator && this.songs?.length > 0) {
        const intervar = setInterval(() => {
          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
            clearInterval(intervar);
          }
        }, 10);
      } else {
        this.dataSource.paginator = this.paginator;
      }
      this.loadingService.addStopLoading();
    },
    err => {
      this.snackBarService.showSnackBar('Oops! Something went wrong, please try again later', 'Close', 5000);
      this.loadingService.addStopLoading();
    });
  }
  onFileSelected(files: FileList): void {
    this.fileToUpload = files.item(0);

    this.screenSizeService.isSmallScreen().pipe(
      first()
    ).subscribe(data => {
      if (data.matches) {
        this.postFile();
      }
    });
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
    this.loadingService.addStartLoading();

    const file = this.fileToUpload;

    // Disable and reset input
    this.resetFileInput();

    const storage = this.account.storage[this.account.storage.findIndex(s => s.name === this.selectedStorage)];

    this.storageService.setSelectedStorage(storage);

    // post a file
    this.songService.post(file, storage.storageID).subscribe(
      data => {
        this.songService.addToData(data);
        this.dataSource.data = this.dataSource.data;
        this.loadingService.addStopLoading();
        this.snackBarService.showSnackBar('File uploaded succesfully', 'Close', 3000);
        this.resetFileInput();
      },
      err => {
        this.snackBarService.showSnackBar(err.error, 'Close', 5000);
        this.resetFileInput();
        this.loadingService.addStopLoading();
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
      () => {
        this.playlistService.clearData();
        this.snackBarService.showSnackBar('Playlist was changed', 'Close', 2000);
      },
      () => this.snackBarService.showSnackBar('Oops! Something went wrong, please try again later', 'Close', 3000)
    );

    // subscribe to removing playlist to song
    dialogRef.componentInstance.removePlaylist.pipe(
      switchMap(pId => {
        return this.songService.removePlaylist(song.id, pId);
      })
    ).subscribe(
      () => {
        this.playlistService.clearData();
        this.snackBarService.showSnackBar('Playlist was changed', 'Close', 2000);
      },
      () => this.snackBarService.showSnackBar('Oops! Something went wrong, please try again later', 'Close', 3000)
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
      switchMap(() => {
        this.loadingService.addStartLoading();
        return this.songService.remove(song.id);
      })
    ).subscribe(() => {
      this.loadingService.addStopLoading();
      this.snackBarService.showSnackBar('Song was deleted', 'Close', 2000);
      this.dataSource.data = this.dataSource.data;
      this.selection.clear();
    },
      () => {
        this.loadingService.addStopLoading();
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
    const fileName = song.fileName;
    this.loadingService.addStartLoading();
    this.songService.getFile(song.id).subscribe(file => {
      this.loadingService.addStopLoading();
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
    const dialogRef = this.matDialog.open(DeleteDialogComponent);

    dialogRef.afterClosed().pipe(
      filter(res => res),
      switchMap(() => {
        this.loadingService.addStartLoading();
        return this.songService.removeRange(this.selection.selected.map(s => s.id));
      })
    ).subscribe(() => {
      this.loadingService.addStopLoading();
      this.snackBarService.showSnackBar('Songs were deleted', 'Close', 2000);
      this.selection.clear();
      this.dataSource.data = this.dataSource.data;
    },
      () => {
        this.loadingService.addStopLoading();
        this.snackBarService.showSnackBar('Oops! Something went wrong, please try again later', 'Close', 3000);
      });
  }
  areStoragesSigned(): boolean {
    return this.account?.storage.length !== 0;
  }
  getSongStorage(song: Song): Storage {
    if (song) {
      return this.account.storage[this.account.storage.findIndex(s => s.storageID === song.storageID)];
    }
    return {
      storageID: 0,
      name: 'Unknown'
    };
  }
  modifySongData(song: Song): void {
    const dialog = this.matDialog.open(ModifySongDataComponent, {
      data: {
        song
      }
    });

    let songData: Song = null;

    dialog.afterClosed()
      .pipe(
        switchMap(data => {
          if (!data) {
            return EMPTY;
          }
          songData = data;
          this.loadingService.addStartLoading();
          return this.songService.put(data);
        })
      ).subscribe(() => {
        this.snackBarService.showSnackBar('Songs data updated', 'Close', 2000);
        let sng = this.songs.find(s => s.id === song.id);
        sng.author = songData.author;
        sng.name = songData.name;

        this.dataSource.data = this.dataSource.data;
        this.loadingService.addStopLoading();
      },
        () => {
          this.loadingService.addStopLoading();
          this.snackBarService.showSnackBar('Oops! Something went wrong, please try again later', 'Close', 3000);
        });
  }
  onFilesUpload(files: File[]): void {

    for (const file of files) {
      const extension = file.name.substring(file.name.lastIndexOf('.'));

      if (!this.allowedExtensions.includes(extension)) {
        this.snackBarService.showSnackBar('This format is not supported', 'Close', 5000);
        return;
      }

      // Show loading
      this.loadingService.addStartLoading();

      const storage = this.account.storage[this.account.storage.findIndex(s => s.name === this.selectedStorage)];

      this.storageService.setSelectedStorage(storage);

      // post a file
      this.songService.post(file, storage.storageID).subscribe(
        data => {
          this.songService.addToData(data);
          this.dataSource.data = this.dataSource.data;
          this.loadingService.addStopLoading();
          this.snackBarService.showSnackBar('File uploaded succesfully', 'Close', 3000);
        },
        err => {
          this.snackBarService.showSnackBar(err.error, 'Close', 5000);
          this.loadingService.addStopLoading();
        });
    }
  }
  onStorageChange(change: MatSelectChange): void {
    const storage = this.account.storage[this.account.storage.findIndex(s => s.name === change.value)];

    this.storageService.setSelectedStorage(storage);
  }
}

