import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Song } from 'src/app/main/shared/models/song.model';
import { SongService } from 'src/app/main/shared/services/song.service';

@Component({
  selector: 'add-songs-to-pl-dialog',
  templateUrl: './add-songs-to-pl-dialog.component.html',
  styleUrls: ['./add-songs-to-pl-dialog.component.scss']
})
export class AddSongsToPlDialogComponent implements OnInit, AfterViewInit {

  dataSource: MatTableDataSource<Song>;

  selection: SelectionModel<Song>;

  displayedColumns = ['select', 'name'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public dialogRef: MatDialogRef<AddSongsToPlDialogComponent>,
    private songService: SongService
  ) { }

  ngAfterViewInit(): void {

    this.getData();
  }

  ngOnInit(): void {
    this.selection = new SelectionModel<Song>(true);

  }

  getData(): void {
    this.songService.getAll().subscribe(data => {
      this.dataSource = new MatTableDataSource(data.concat(data.concat(data.concat(data))));
      this.dataSource.paginator = this.paginator;
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
}
