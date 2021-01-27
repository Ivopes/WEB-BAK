import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Playlist } from 'src/app/main/shared/models/playlist.model';
import { Song } from 'src/app/main/shared/models/song.model';
import { PlaylistService } from 'src/app/main/shared/services/playlist.service';

@Component({
  selector: 'app-playlist-detail',
  templateUrl: './playlist-detail.component.html',
  styleUrls: ['./playlist-detail.component.scss']
})
export class PlaylistDetailComponent implements OnInit {
  playlist: Playlist;

  displayedColumns = ['id', 'name'];

  constructor(
    private playlistService: PlaylistService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number.parseInt(params.get('id'), 10);
        return this.playlistService.GetById(id);
      })
    ).subscribe(data => {
      console.log(data);
      //this.songs = data;
      this.playlist = data;
    });
  }
}
