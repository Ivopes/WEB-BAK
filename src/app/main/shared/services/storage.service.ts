import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../../config/constants';
import { Storage } from '../models/storage.model';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable({providedIn: 'root'})
export class StorageService {

  private readonly controller: string = 'storage';

  private data: Storage[];

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

}
