import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from '../../../config/constants';
import { Song } from '../models/song.model';

@Injectable({providedIn: 'root'})
export class Mp3Service {
  constructor(
    private httpClient: HttpClient,
    private constants: Constants,
    ) { }

  private readonly controller: string = 'song';

  public getAll(): Observable<Song[]> {
    return this.httpClient.get<Song[]>(`${this.constants.API_ENDPOINT}/${this.controller}`);
  }
  public post(file: File): Observable<boolean> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.httpClient.post<boolean>(`${this.constants.API_ENDPOINT}/${this.controller}`,
    formData
    );
  }
}
