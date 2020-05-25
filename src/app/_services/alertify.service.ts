import { Injectable } from '@angular/core';
import * as alertify from 'alertifyjs';
@Injectable({
  providedIn: 'root'
})
export class AlertifyService {

constructor() { }

  success(message: string) {
    alertify.success(message, 2);
  }
  message(message: string) {
    alertify.message(message, 2);
  }

}
