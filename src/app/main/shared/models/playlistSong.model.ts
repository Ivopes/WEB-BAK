import { Playlist } from './playlist.model';
import { Song } from './song.model';

export interface PlaylistSong{
  playlist: Playlist;
  playlistID: number;
  song: Song;
  songID: number;
}
