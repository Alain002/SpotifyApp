import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

authToken: any;
constructor(private http: HttpClient) { }

accessData() {
  this.authToken = localStorage.getItem('access_token');
  const headers = new HttpHeaders()
            .set('Authorization', 'Bearer ' + this.authToken);

  return this.http.get('https://api.spotify.com/v1/me', {headers})
  .pipe(
    map(
      (response: any) => {

      }
    )
  );
}

}
