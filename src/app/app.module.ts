import { ArtistSearchService } from './_services/artist-search.service';
import { RoundPipe } from './_pipes/round.pipe';
import { AuthService } from './_services/auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './routes';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { ArtistSearchComponent } from './artist-search/artist-search.component';
import { ArtistSearchResultsComponent } from './artist-search-results/artist-search-results.component';
import { ArtistAlbumsComponent } from './artist-albums/artist-albums.component';
import { ArtistAlbumsService } from './_services/artist-albums.service';
import {FormsModule} from '@angular/forms';
import { ErrorPageComponent } from './error-page/error-page.component';

@NgModule({
   declarations: [
      AppComponent,
      NavComponent,
      HomeComponent,
      LoginComponent,
      ArtistSearchComponent,
      ArtistSearchResultsComponent,
      RoundPipe,
      ArtistAlbumsComponent,
      ErrorPageComponent
   ],
   imports: [
      BrowserModule,
      RouterModule.forRoot(appRoutes),
      HttpClientModule,
      FormsModule
   ],
   providers: [
      AuthService,
      ArtistSearchService,
      ArtistAlbumsService
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
