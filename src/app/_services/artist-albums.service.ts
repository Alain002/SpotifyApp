import { ArtistAlbum } from './../_models/artistAlbum.model';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ArtistAlbumsService {

accessToken = '';
artistAlbumSubject = new BehaviorSubject<ArtistAlbum>(null);
constructor(private http: HttpClient) { }

getAlbums(url: string, offsetValue: number) {
  this.accessToken = localStorage.getItem('access_token');
  const headers = new HttpHeaders()
            .set('Authorization', 'Bearer ' + this.accessToken);
  return this.http.get(url + '/albums?limit=20&offset=' + offsetValue, {headers});
}

}
