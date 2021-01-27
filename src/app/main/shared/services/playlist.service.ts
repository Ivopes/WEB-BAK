import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Constants } from '../../../config/constants';
import { Playlist } from '../models/playlist.model';
import { tap } from 'rxjs/operators';
import { Song } from '../models/song.model';

@Injectable({providedIn: 'root'})
export class PlaylistService {

  private readonly controller: string = 'playlist';

  private data: Playlist[];

  constructor(
    private httpClient: HttpClient,
    private constants: Constants,
    ) { }

  public clearData(): void {
    this.data = null;
  }
  public GetAll(): Observable<Playlist[]> {
    if (this.data) {
      return of(this.data);
    }
    return this.httpClient.get<Playlist[]>(`${this.constants.API_ENDPOINT}/${this.controller}`).pipe(
      tap(data => {
        this.data = data;
      })
    );
  }
  public GetById(id: number): Observable<Playlist> {
    return this.httpClient.get<Playlist>(`${this.constants.API_ENDPOINT}/${this.controller}/${id}`);
  }
  public Post(playlist: Playlist): Observable<any> {
    return this.httpClient.post(`${this.constants.API_ENDPOINT}/${this.controller}`,
      playlist
    );
  }
}
