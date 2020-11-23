import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from '../../../config/constants';
import { Playlist } from '../models/playlist.model';

@Injectable({providedIn: 'root'})
export class PlaylistService {

  private readonly controller: string = 'playlist';

  constructor(
    private httpClient: HttpClient,
    private constants: Constants,
    ) { }

  public GetAll(): Observable<Playlist[]> {
    return this.httpClient.get<Playlist[]>(`${this.constants.API_ENDPOINT}/${this.controller}`);
  }
  public Post(playlist: Playlist): Observable<any> {
    return this.httpClient.post(`${this.constants.API_ENDPOINT}/${this.controller}`,
      playlist
    );
  }
}
