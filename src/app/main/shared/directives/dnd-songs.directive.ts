import { Directive, HostListener, HostBinding, ElementRef } from '@angular/core';
import { DndDirectiveBase } from './dnd.directive';
import { DomSanitizer } from '@angular/platform-browser';
import { SnackBarService } from '../services/snackBar.service';
import { getLocaleFirstDayOfWeek } from '@angular/common';

@Directive({
  selector: '[appDndSongs]'
})
export class DndSongsDirective {

  @HostBinding('style.background-color') private backgroundColor;
  @HostBinding('style.display') private display;
  @HostBinding('style.z-index') private zIndex;

  private counter: number = 0;

  constructor(
    private snackBarService: SnackBarService,
    private el: ElementRef
  ) {}

  /*@HostListener('dragover', ['$event']) public onDragOver(evt: DragEvent): void {
    evt.preventDefault();
    evt.stopPropagation();
    /*if (this.counter++ === 0){
      console.log(evt);
      console.log('over');
      this.show();
    }
    console.log('drageover');

  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt: DragEvent): void {
    evt.preventDefault();
    evt.stopPropagation();
    if (--this.counter === 0) {
      console.log(evt);
      console.log('leave');
      this.hide();
    }
    //console.log('dragleave');
  }*/

  @HostListener('drop', ['$event']) public onDrop(evt: DragEvent): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.hide();

    this.counter = 0;

    for (let i = 0; i < evt.dataTransfer.files.length; i++) {
      console.log(evt.dataTransfer.files[i]);
      this.snackBarService.showSnackBar(evt.dataTransfer.files[i].name, 'close', 5000);
    }
  }

  private show(): void {
    this.backgroundColor = 'rgba(0,0,0,0.5)';
    this.display = 'block';
    //this.zIndex = 2;
  }
  private hide(): void {
    this.backgroundColor = 'rgba(0,0,0,0)';
    this.display = 'none';
    //this.zIndex = -1;
  }
  @HostListener('window:dragenter', ['$event']) onDragEnter(evt: DragEvent): void {
    evt.preventDefault();
    evt.stopPropagation();
    if (this.counter++ === 0){
      console.log(event);
      console.log('enter');
      this.show();
    }
  }
  @HostListener('window:dragleave', ['$event']) onDragLeave(evt: DragEvent): void {
    evt.preventDefault();
    evt.stopPropagation();
    if (--this.counter === 0) {
      console.log(evt);
      console.log('leave');
      this.hide();
    }
  }
  @HostListener('window:dragover', ['$event']) onDragOver(evt: DragEvent): void {
    evt.preventDefault();
    evt.stopPropagation();
  }
  @HostListener('window:drop', ['$event']) onDragDrop(evt: DragEvent): void {
    evt.preventDefault();
    evt.stopPropagation();


    this.counter = 0;
    this.hide();

    console.log('DROOOOOOP');

  }
  /*@HostListener('drop', ['$event']) onMessagaa(evt: DragEvent) {
    console.log(evt);
    console.log('drop');
  }*/

}
