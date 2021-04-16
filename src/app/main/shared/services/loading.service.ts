import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class LoadingService {

  public loading = new BehaviorSubject<boolean>(false);

  private counter = 0;

  constructor() { }

  addStartLoading(): void {
    if (this.counter++ === 0) {
      this.loading.next(true);
    }
  }

  addStopLoading(): void {
    if (--this.counter < 1) {
      this.loading.next(false);
      this.counter = 0;
    }
  }
}
