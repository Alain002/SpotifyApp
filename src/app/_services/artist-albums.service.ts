import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ArtistAlbumsService {

accessToken = '';
constructor(private http: HttpClient) { }

getAlbums(url: string) {
  this.accessToken = localStorage.getItem('access_token');
  const headers = new HttpHeaders()
            .set('Authorization', 'Bearer ' + this.accessToken);
  return this.http.get(url + '/albums?limit=8', {headers});
}

}
