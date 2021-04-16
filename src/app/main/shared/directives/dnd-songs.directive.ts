import { Directive, HostListener, HostBinding, ElementRef, Input, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appDndSongs]'
})
export class DndSongsDirective {

  @Output() filesUpload = new EventEmitter<File[]>();

  @HostBinding('style.background-color') private backgroundColor: string;
  @HostBinding('style.display') private display: string;

  private counter = 0;

  constructor() {}

  @HostListener('drop', ['$event']) public onDrop(evt: DragEvent): void {
    evt.preventDefault();
    evt.stopPropagation();

    this.hide();

    this.counter = 0;

    const files: File[] = [];

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < evt.dataTransfer.files.length; i++) {
      files.push(evt.dataTransfer.files[i]);
    }
    this.filesUpload.emit(files);
  }
  @HostListener('window:dragenter', ['$event']) onDragEnter(evt: DragEvent): void {
    evt.preventDefault();
    evt.stopPropagation();
    if (this.counter++ === 0){
      this.show();
    }
  }
  @HostListener('window:dragleave', ['$event']) onDragLeave(evt: DragEvent): void {
    evt.preventDefault();
    evt.stopPropagation();
    if (--this.counter === 0) {
      this.hide();
    }
  }
  // Must be implementes so drop event can work properly
  @HostListener('window:dragover', ['$event']) onDragOver(evt: DragEvent): void {
    evt.preventDefault();
    evt.stopPropagation();
  }
  @HostListener('window:drop', ['$event']) onDragDrop(evt: DragEvent): void {
    evt.preventDefault();
    evt.stopPropagation();

    this.counter = 0;
    this.hide();
  }
  private show(): void {
    this.backgroundColor = 'rgba(0,0,0,0.6)';
    this.display = 'table';
  }
  private hide(): void {
    this.backgroundColor = 'rgba(0,0,0,0)';
    this.display = 'none';
  }
}
