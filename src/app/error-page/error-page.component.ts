import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    // remove the token from localstorage because it is expired
    localStorage.removeItem('access_token');
  }

}
