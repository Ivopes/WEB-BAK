import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Constants } from '../../../config/constants';
import { Song } from '../models/song.model';
import { tap } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class SongService {

  private data: Song[];

  constructor(
    private httpClient: HttpClient,
    private constants: Constants,
    ) { }

  private readonly controller: string = 'song';

  public getAll(): Observable<Song[]> {
    if (this.data) {
      return of(this.data);
    }

    return this.httpClient.get<Song[]>(`${this.constants.API_ENDPOINT}/${this.controller}`).pipe(
      tap(data => {
        this.data = data;
      })
    );
  }
  public post(file: File): Observable<boolean> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.httpClient.post<boolean>(`${this.constants.API_ENDPOINT}/${this.controller}`,
    formData
    );
  }
}
