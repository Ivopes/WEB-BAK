import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Constants } from '../../../config/constants';
import { Song } from '../models/song.model';
import { share, shareReplay, switchMap, tap } from 'rxjs/operators';
import { PlaylistSong } from '../models/playlistSong.model';
import { Playlist } from '../models/playlist.model';
import { PlaylistService } from './playlist.service';
import { LowerCasePipe } from '@angular/common';

@Injectable({providedIn: 'root'})
export class SongService {

  private data: Song[];

  constructor(
    private httpClient: HttpClient,
    private constants: Constants,

    ) { }

  private readonly controller: string = 'song';


  public getFile(id: number): Observable<any> {
    return this.httpClient.get(`${this.constants.API_ENDPOINT}/${this.controller}/file/${id}`, {
      responseType: 'blob'
    });
  }

  public clearData(): void {
    this.data = null;
  }
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
  public post(file: File, storageID: number): Observable<Song> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    formData.append('storageID', storageID.toString());

    return this.httpClient.post<Song>(`${this.constants.API_ENDPOINT}/${this.controller}`,
    formData
    );
  }
  public addPlaylistToSong(sId: number, pId: number): Observable<any> {
    if (!this.data) {
      return this.getAll().pipe(
        switchMap(() => {
          this.addPlaylistToData(sId, pId);
          return this.httpClient.get<any>(`${this.constants.API_ENDPOINT}/${this.controller}/pl/${sId}/${pId}`);
        })
      );
    } else {
      this.addPlaylistToData(sId, pId);
      return this.httpClient.get<any>(`${this.constants.API_ENDPOINT}/${this.controller}/pl/${sId}/${pId}`);
    }
  }
  public removePlaylist(sId: number, pId: number): Observable<any> {
    if (!this.data) {
      return this.getAll().pipe(
        switchMap(() => {
          this.removePlaylistFromData(sId, pId);

          return this.httpClient.delete<any>(`${this.constants.API_ENDPOINT}/${this.controller}/pl/${sId}/${pId}`);
        })
      );
    } else {
      this.removePlaylistFromData(sId, pId);

      return this.httpClient.delete<any>(`${this.constants.API_ENDPOINT}/${this.controller}/pl/${sId}/${pId}`);
    }
  }
  public remove(id: number): Observable<any> {
    this.deleteSongFromData(id);

    return this.httpClient.delete<any>(`${this.constants.API_ENDPOINT}/${this.controller}/${id}`);
  }
  public removeRange(ids: number[]): Observable<any> {
    ids.forEach(sId => {
      this.deleteSongFromData(sId);
    });

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: ids
    };

    return this.httpClient.delete<any>(`${this.constants.API_ENDPOINT}/${this.controller}`, options);
  }
  private removePlaylistFromData(sId: number, pId: number): void {
    const song = this.data.find(s => s.id === sId);

    song.playlists.splice(song.playlists.findIndex(p => p.id === pId), 1);
  }
  private addPlaylistToData(sId: number, pId: number): void {
    const pl: Playlist = {
      id: pId,
      name: null,
      songs: null,
      sync: null
    };
    this.data.find(s => s.id === sId).playlists.push(pl);
  }
  private deleteSongFromData(id: number): void {
    this.data.splice(this.data.findIndex(s => s.id === id), 1);
  }
  public addToData(song: Song): void {
    this.data.push(song);
  }
}
