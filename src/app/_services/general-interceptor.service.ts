import { ErrorService } from './error.service';
import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ErrorRequestInfo } from '../_models/error-request-info.model';

export class GeneralInterceptorService implements HttpInterceptor {

    errorRequestInfo: ErrorRequestInfo;
    constructor(private route: Router, private errorervice: ErrorService ) {}
    intercept( req: HttpRequest<any>, next: HttpHandler) {
      return next.handle(req).pipe(
        tap(event => {
        }, error => {
          if (error.status === 404) {
            this.route.navigate(['error-page']).then(
              () => {
                this.errorRequestInfo = new ErrorRequestInfo();
                this.errorRequestInfo.title = 'not-found';
                this.errorervice.errorSubject.next(this.errorRequestInfo);
              }
            );
          } else if (error.status === 401) {
            this.route.navigate(['error-page']).then(
              () => {
                this.errorRequestInfo = new ErrorRequestInfo();
                this.errorRequestInfo.title = 'Unauthorized';
                this.errorervice.errorSubject.next(this.errorRequestInfo);
              }
            );
          } else if (error.status >= 500 && error.status <= 599) {
            this.route.navigate(['error-page']).then(
              () => {
                this.errorRequestInfo = new ErrorRequestInfo();
                this.errorRequestInfo.title = 'server-error';
                this.errorRequestInfo.statusCode = error.status;
                this.errorervice.errorSubject.next(this.errorRequestInfo);
              }
            );
          } else if (error.status >= 300 && error.status <= 399) {
            this.route.navigate(['error-page']).then(
              () => {
                this.errorRequestInfo = new ErrorRequestInfo();
                this.errorRequestInfo.title = 'redirection-error';
                this.errorRequestInfo.statusCode = error.status;
                this.errorervice.errorSubject.next(this.errorRequestInfo);
              }
            );
          } else if (error.status >= 400 && error.status <= 499) {
            this.route.navigate(['error-page']).then(
              () => {
                this.errorRequestInfo = new ErrorRequestInfo();
                this.errorRequestInfo.title = 'client-error';
                this.errorRequestInfo.statusCode = error.status;
                this.errorervice.errorSubject.next(this.errorRequestInfo);
              }
            );
          }
        }
        )
      );
    }
}
