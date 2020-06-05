import { AlbumArtist } from './../_models/albumArtist';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Artist } from '../_models/artist.model';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArtistSearchService {

  baseUrl = environment.apiUrl;
  accessToken = '';
  artistsSubject = new BehaviorSubject<Artist[]>(null);
  pageNumberSubject = new BehaviorSubject<number>(1);
  albumArtistSubject = new BehaviorSubject<AlbumArtist>(null);
  constructor(private http: HttpClient) { }

  search(artistSearchValue, offsetValue) {
    this.accessToken = localStorage.getItem('access_token');
    const headers = new HttpHeaders()
              .set('Authorization', 'Bearer ' + this.accessToken);
    return this.http.get(this.baseUrl + 'search?q=' + artistSearchValue + '&type=artist&offset=' +
    offsetValue + '&limit=20', { headers });
  }
}
