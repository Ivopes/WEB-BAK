import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, first, mergeMap, switchMap } from 'rxjs/operators';
import { DeleteDialogComponent } from 'src/app/main/shared/components/dialogs/delete-dialog/delete-dialog.component';
import { Playlist } from 'src/app/main/shared/models/playlist.model';
import { Song } from 'src/app/main/shared/models/song.model';
import { LoadingService } from 'src/app/main/shared/services/loading.service';
import { PlaylistService } from 'src/app/main/shared/services/playlist.service';
import { ScreenSizeService } from 'src/app/main/shared/services/screenSize.service';
import { SnackBarService } from 'src/app/main/shared/services/snackBar.service';
import { SongService } from 'src/app/main/shared/services/song.service';
import { AddSongsToPlDialogComponent } from './add-songs-to-pl-dialog/add-songs-to-pl-dialog.component';

@Component({
  selector: 'app-playlist-detail',
  templateUrl: './playlist-detail.component.html',
  styleUrls: ['./playlist-detail.component.scss']
})
export class PlaylistDetailComponent implements OnInit {

  playlist: Playlist;

  /**
   * table columns to display
   */
  displayedColumns = [];

  selection: SelectionModel<Song>;

  dataSource: MatTableDataSource<Song>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private playlistService: PlaylistService,
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog,
    private songService: SongService,
    private snackBarService: SnackBarService,
    private loadingService: LoadingService,
    public screenSizeService: ScreenSizeService
  ) { }

  ngOnInit(): void {
    this.selection = new SelectionModel<Song>(true);

    this.getData();

    this.screenSizeService.isSmallScreen().subscribe(data => {
      if (data.matches) {
        this.displayedColumns = ['select', 'name', 'remove'];
      } else {
        this.displayedColumns = ['select', 'name', 'author', 'length' , 'remove'];
      }
    });

  }

  private getData(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        this.loadingService.startLoading();
        const id = Number.parseInt(params.get('id'), 10);
        return this.playlistService.getById(id);
      })
    ).subscribe(data => {
      this.playlist = data;
      //this.dataSource = new MatTableDataSource(data.songs.concat(data.songs.concat(data.songs.concat(data.songs.concat(data.songs)))));
      this.dataSource = new MatTableDataSource(data.songs);
      this.dataSource.paginator = this.paginator;
      this.loadingService.stopLoading();
    },
    err => {
      this.snackBarService.showSnackBar('Oops! Something went wrong, please try again later', 'Close', 3000);
      this.loadingService.stopLoading();
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
  removeFromPl(row?: Song): void {
    const dialogRef = this.matDialog.open(DeleteDialogComponent);

    dialogRef.afterClosed().pipe(
      filter(res => res)
    ).subscribe(() => {
      if (!row) {
        this.selection.selected.forEach( s => {
          this.songService.removePlaylist(s.id, this.playlist.id).subscribe(
            () => this.snackBarService.showSnackBar('Playlist was changed', 'Close', 2000),
            err => this.snackBarService.showSnackBar('Oops! Something went wrong, please try again later', 'Close', 3000));
        });
        this.dataSource.data = this.dataSource.data.filter(s => !this.selection.selected.includes(s));
        this.selection.clear();
        return;
      }
      this.songService.removePlaylist(row.id, this.playlist.id).subscribe(
        () => this.snackBarService.showSnackBar('Playlist was changed', 'Close', 2000),
        err => this.snackBarService.showSnackBar('Oops! Something went wrong, please try again later', 'Close', 3000)
      );
      this.dataSource.data = this.dataSource.data.filter(s => s !== row);
    });
  }
  toPlaylists(): void {
    this.router.navigate(['/playlists']);
  }
  addSongs(): void {

    this.screenSizeService.isSmallScreen().pipe(
      first()
    ).subscribe(data => {
      let dialogRef;
      if (data.matches) {
        dialogRef = this.matDialog.open(AddSongsToPlDialogComponent, {
          data: {
            songs: this.dataSource.data,
            playlist: this.playlist
          },
          minWidth: '90vw'
        });
      } else {
        dialogRef = this.matDialog.open(AddSongsToPlDialogComponent, {
          data: {
            songs: this.dataSource.data,
            playlist: this.playlist
          },
          minWidth: '50vw'
        });
      }
      dialogRef.afterClosed().subscribe(() => {
        this.selection.clear();

        this.getData();
      });

    });
  }
}
