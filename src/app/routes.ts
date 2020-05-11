import { ErrorPageComponent } from './error-page/error-page.component';
import { ArtistAlbumsComponent } from './artist-albums/artist-albums.component';
import { ArtistSearchComponent } from './artist-search/artist-search.component';

import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const appRoutes: Routes =  [
  { path: '', component: HomeComponent},
  { path: 'callback', component: ArtistSearchComponent},
  { path: 'artist-albums', component: ArtistAlbumsComponent},
  { path: 'error-page', component: ErrorPageComponent },
  { path: '**', redirectTo: '', pathMatch: 'full'}
];
