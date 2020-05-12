import { ArtistSearchService } from './../_services/artist-search.service';
import { Artist } from './../_models/artist.model';
import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-artist-search-results',
  templateUrl: './artist-search-results.component.html',
  styleUrls: ['./artist-search-results.component.css']
})
export class ArtistSearchResultsComponent implements OnInit, OnDestroy {

  artistsSubscription: Subscription;
  artists: Artist[] = [];
  ratingList = [1, 2, 3, 4, 5];
  constructor(private artistSearchService: ArtistSearchService,
              private router: Router) { }
  ngOnInit() {
    // get the data from the behavior subject
    this.artistsSubscription = this.artistSearchService.artistsSubject.subscribe(
      dataArtists => {
        this.artists = dataArtists;
      }
    );
  }
  ngOnDestroy(): void {
    this.artistsSubscription.unsubscribe();
  }

  artistClicked(artist: Artist) {
    // send data to the album component
    this.router.navigate(['/artist-albums', {url: artist.spotify, typedName: artist.typedName, name: artist.name}]);
  }

}

