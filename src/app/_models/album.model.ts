import { Artist } from './artist.model';
export class Album {
  id: string;
  name: string;
  image: string;
  releaseDate: string;
  totalTracks: string;
  artists: Artist[];
  spotify: string;
}
