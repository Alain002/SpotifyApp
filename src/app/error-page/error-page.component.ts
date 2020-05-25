import { ErrorRequestInfo } from './../_models/error-request-info.model';
import { ErrorService } from './../_services/error.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent implements OnInit {

  errorType = '';
  errorMessage = '';
  constructor( private route: ActivatedRoute,
               private router: Router,
               private error: ErrorService) { }

  ngOnInit() {

    this.error.errorSubject.subscribe(
      errorRequestInfo => {
        if (errorRequestInfo.title == null) {
          this.router.navigate(['/']);
        } else if (errorRequestInfo.title === 'server-error' ||
            errorRequestInfo.title === 'redirection-error' ||
            errorRequestInfo.title === 'client-error') {
              if (errorRequestInfo.statusCode === null) {
                this.router.navigate(['/']);
              } else {
                this.errorType = 'Error ' + errorRequestInfo.statusCode;
                if (errorRequestInfo.title === 'server-error') {
                  this.errorMessage = 'Server error';
                } else if (errorRequestInfo.title === 'redirection-error') {
                  this.errorMessage = 'Redirection error';
                } else if (errorRequestInfo.title === 'client-error') {
                  this.errorMessage = 'Client error';
                }
              }
            } else if (errorRequestInfo.title.toLocaleLowerCase() === 'unauthorized') {
              localStorage.removeItem('access_token');
              this.errorType = 'Error 401';
              this.errorMessage = 'Unauthorized, please login to retrieve a valid token.';
            } else if (errorRequestInfo.title === 'not-found') {
              this.errorType = 'Error 404';
              this.errorMessage = 'Page not found';
            }
      });
    // remove the token from localstorage because it is expired
    // this.route.paramMap.subscribe(
    //   params => {
    //   //   const title = params.get('title');
    //   //   if (title === null) {
    //   //     this.router.navigate(['/']);
    //   //   } else {
    //   //   if (title === 'not-found') {
    //   //     this.errorType = 'Error 404';
    //   //     this.errorMessage = 'Page not found';
    //   //   } else if (title === 'unauthorized') {
    //   //     localStorage.removeItem('access_token');
    //   //     this.errorType = 'Error 401';
    //   //     this.errorMessage = 'Unauthorized, please login to retrieve a valid token.';
    //   //   } else if (title === 'server-error') {
    //   //     if (params.get('statusCode') == null) {
    //   //       this.router.navigate(['/']);
    //   //     } else {
    //   //       this.errorType = 'Error ' + params.get('statusCode');
    //   //       this.errorMessage = 'Server error';
    //   //     }
    //   //   } else if (title === 'redirection-error') {
    //   //     if (params.get('statusCode') == null) {
    //   //       this.router.navigate(['/']);
    //   //     } else {
    //   //       this.errorType = 'Error ' + params.get('statusCode');
    //   //       this.errorMessage = 'Redirection error';
    //   //     }
    //   //   }
    //   // }
    // });
  }
}
