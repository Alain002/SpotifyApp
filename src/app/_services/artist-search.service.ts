import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Artist } from '../_models/artist.model';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArtistSearchService {

  baseUrl = 'https://api.spotify.com/v1/search?';
  accessToken = '';
  artistsSubject = new BehaviorSubject<Artist[]>(null);
constructor(private http: HttpClient) { }

search(artistSearchValue) {
  this.accessToken = localStorage.getItem('access_token');
  const headers = new HttpHeaders()
            .set('Authorization', 'Bearer ' + this.accessToken);
  return this.http.get(this.baseUrl + 'q=' + artistSearchValue + '&type=artist&limit=8', { headers });
}



}
