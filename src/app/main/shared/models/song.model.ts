import { Playlist } from './playlist.model';

export interface Song {
  id: number;
  name: string;
  playlists: Playlist[];
}
