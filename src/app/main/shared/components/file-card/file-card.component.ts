import { Component, Input, OnInit } from '@angular/core';
import { Song } from '../../models/song.model';

@Component({
  selector: 'app-file-card',
  templateUrl: './file-card.component.html',
  styleUrls: ['./file-card.component.scss']
})
export class FileCardComponent implements OnInit {

  constructor() { }

  @Input() song: Song = null;
  subName = 'subName';

  ngOnInit(): void {
  }

}
