import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-file-card',
  templateUrl: './file-card.component.html',
  styleUrls: ['./file-card.component.scss']
})
export class FileCardComponent implements OnInit {

  constructor() { }

  @Input() name = 'FileName';
  subName = 'subName';

  ngOnInit(): void {
  }

}
