import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class LoadingService {

  public loading = new BehaviorSubject<boolean>(false);

  constructor() { }

  startLoading(): void {
    this.loading.next(true);
  }

  stopLoading(): void {
    this.loading.next(false);
  }
}
