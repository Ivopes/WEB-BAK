import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewChecked, AfterViewInit, Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Playlist } from 'src/app/main/shared/models/playlist.model';
import { Song } from 'src/app/main/shared/models/song.model';
import { ScreenSizeService } from 'src/app/main/shared/services/screenSize.service';
import { SnackBarService } from 'src/app/main/shared/services/snackBar.service';
import { SongService } from 'src/app/main/shared/services/song.service';
import { AddToPlDialogComponent } from '../../../songs/add-to-pl-dialog/add-to-pl-dialog.component';

@Component({
  selector: 'add-songs-to-pl-dialog',
  templateUrl: './add-songs-to-pl-dialog.component.html',
  styleUrls: ['./add-songs-to-pl-dialog.component.scss']
})
export class AddSongsToPlDialogComponent implements OnInit, AfterViewInit {

  dataSource: MatTableDataSource<Song>;

  selection: SelectionModel<Song>;

  displayedColumns = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public dialogRef: MatDialogRef<AddSongsToPlDialogComponent>,
    private songService: SongService,
    private snackBarService: SnackBarService,
    public screenSizeService: ScreenSizeService,
    @Inject(MAT_DIALOG_DATA) public data: {
      playlist: Playlist,
      songs: Song[]
    }
  ) { }

  ngAfterViewInit(): void {
    this.getData();
  }

  ngOnInit(): void {
    this.selection = new SelectionModel<Song>(true);

    this.screenSizeService.isSmallScreen().subscribe(data => {
      if (data.matches) {
        this.displayedColumns = ['select', 'name'];
      } else {
        this.displayedColumns = ['select', 'name', 'author', 'length'];
      }
    });

  }

  getData(): void {
    this.songService.getAll().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;

      this.checkPlaylists();
    });
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    if (this.isAllSelected()) {
      this.dataSource.data.forEach(row => {
          this.toggleRow(row);
      });
    } else {
      this.dataSource.data.forEach(row => {
        if (!this.selection.isSelected(row)) {
          this.toggleRow(row);
        }
      });
    }
  }
  toggleRow(row: Song): void {
    this.selection.toggle(row);

    if (this.selection.isSelected(row)) {
      this.songService.addPlaylistToSong(row.id, this.data.playlist.id).subscribe(
        () => {
          this.snackBarService.showSnackBar('Playlist was changed', 'Close', 2000);
        },
        err => this.snackBarService.showSnackBar('Oops! Something went wrong, please try again later', 'Close', 3000)
      );
    } else {
      this.songService.removePlaylist(row.id, this.data.playlist.id).subscribe(
        () => {
          this.snackBarService.showSnackBar('Playlist was changed', 'Close', 2000);
        },
        err => this.snackBarService.showSnackBar('Oops! Something went wrong, please try again later', 'Close', 3000)
      );
    }
  }
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  checkPlaylists(): void {
    const checkIds = this.data.songs.map(s => s.id);

    for (const s of this.dataSource.data) {
      if (checkIds.includes(s.id)) {
        this.selection.select(s);
      }
    }
  }


}
