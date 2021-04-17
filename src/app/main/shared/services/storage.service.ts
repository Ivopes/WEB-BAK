import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../../config/constants';
import { Storage } from '../models/storage.model';
import { Observable, of } from 'rxjs';
import { tap, first, map } from 'rxjs/operators';


@Injectable({providedIn: 'root'})
export class StorageService {

  private readonly controller: string = 'storage';

  private data: Storage[];

  private selectedStorage: Storage = null;

  constructor(
    private httpClient: HttpClient,
    private constants: Constants
    ) { }

  public getAll(): Observable<Storage[]> {
    if (this.data) {
      return of(this.data);
    }

    return this.httpClient.get<Storage[]>(`${this.constants.API_ENDPOINT}/${this.controller}`).pipe(
      tap(data => {
        this.data = data;
      })
    );
  }
  public clearData(): void {
    this.data = null;
    this.selectedStorage = null;
  }

  public getSelectedStorage(): Observable<Storage> {

    if (this.selectedStorage) {
      return of(this.selectedStorage);
    }
    return this.getAll().pipe(
      map(data => {
        if (data.length > 0) {
          this.selectedStorage = data[0];
        } else {
          this.selectedStorage = null;
        }
        return this.selectedStorage;
      })
    );
  }

  public setSelectedStorage(storage: Storage): void {
    this.selectedStorage = storage;
  }
}
