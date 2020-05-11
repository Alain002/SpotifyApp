import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ArtistAlbumsService {

// baseUrl = 'https://api.spotify.com/v1/artists';
accessToken = '';
constructor(private http: HttpClient) { }

getAlbums(url: string) {
  console.log(url);
  this.accessToken = localStorage.getItem('access_token');
  const headers = new HttpHeaders()
            .set('Authorization', 'Bearer ' + this.accessToken);
  return this.http.get(url + '/albums?limit=8', {headers});
}

}
