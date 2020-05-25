import { ErrorRequestInfo } from './../_models/error-request-info.model';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

errorSubject = new BehaviorSubject<ErrorRequestInfo>(null);
constructor() { }
}
