import { Playlist } from './playlist.model';

export interface Song {
  id: number;
  fileName: string;
  name: string;
  author: string;
  lengthSec: number;
  playlists: Playlist[];
}
