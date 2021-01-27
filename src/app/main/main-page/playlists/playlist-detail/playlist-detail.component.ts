import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Playlist } from 'src/app/main/shared/models/playlist.model';
import { Song } from 'src/app/main/shared/models/song.model';
import { PlaylistService } from 'src/app/main/shared/services/playlist.service';

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
  displayedColumns = ['select', 'id', 'name', 'remove'];

  selection: SelectionModel<Song>;

  @ViewChild(MatSort) sort: MatSort;

  dataSource: MatTableDataSource<Song>;

  constructor(
    private playlistService: PlaylistService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const initialSelection = [];
    const allowMultiSelect = true;
    this.selection = new SelectionModel<Song>(allowMultiSelect, initialSelection);

    this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number.parseInt(params.get('id'), 10);
        return this.playlistService.GetById(id);
      })
    ).subscribe(data => {
      this.playlist = data;
      this.dataSource = new MatTableDataSource(data.songs);
    });
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.playlist.songs.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.isAllSelected() ?
        this.selection.clear() :
        this.playlist.songs.forEach(row => this.selection.select(row));
  }

  removeFromPl(row): void {
    this.dataSource.data = this.dataSource.data.filter(s => s !== row);
  }
}
