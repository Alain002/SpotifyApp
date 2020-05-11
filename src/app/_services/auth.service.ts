import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

url = `https://accounts.spotify.com/authorize?client_id=246813d0993941d296f414f86ee53fbc
&redirect_uri=localhost:4200/Fcallback&scope=user-read-private%20user-read-email
&response_type=token&state=123`;
data: any;
authToken: any;
constructor(private http: HttpClient) { }

login() {


  return this.http.get(this.url)
  .pipe(
    map(
      (response: any) => {
        this.data = response;
        console.log(this.data);
      }
    )
  );
}
accessData() {
  // const headers = new Headers({
  //   Authorization: 'Bearer ' + this.authToken,
  //   Accept: 'application/json'
  // });
  // const requestOptions = {
  //   headers: new Headers(headers),
  // };
  this.authToken = localStorage.getItem('access_token');
  const headers = new HttpHeaders()
            .set('Authorization', 'Bearer ' + this.authToken);

  return this.http.get('https://api.spotify.com/v1/me', {headers})
  .pipe(
    map(
      (response: any) => {

        // console.log(response);
      }
    )
  );
}

}
