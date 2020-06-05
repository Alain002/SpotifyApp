import { ArtistAlbumsService } from './../_services/artist-albums.service';
import { ArtistAlbum } from './../_models/artistAlbum.model';
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
  pageNumberSubscription: Subscription;
  artistNumberSubcription: Subscription;
  artists: Artist[] = [];
  ratingList = [1, 2, 3, 4, 5];
  pageNumber = 1;
  resultNotFound = false;
  test: any;

  constructor(private artistSearchService: ArtistSearchService,
              private router: Router, private artistAlbumService: ArtistAlbumsService) { }
  ngOnInit() {
    // get the data from the behavior subject
    this.resultNotFound = false;
    this.artistsSubscription = this.artistSearchService.artistsSubject.subscribe(
      dataArtists => {
        this.artists = dataArtists;
        if (dataArtists !== null) {
          this.resultNotFound = (dataArtists.length === 0);
        }
      }
    );
    this.pageNumberSubscription = this.artistSearchService.pageNumberSubject.subscribe(
      pageNumber => {
        this.pageNumber = pageNumber;
      }
    );
  }
  ngOnDestroy(): void {
    this.artistsSubscription.unsubscribe();
  }

  artistClicked(artist: Artist) {
    // send data to the album component
    this.router.navigate(['/artist-albums']);
    const artistAlbum = new ArtistAlbum();
    artistAlbum.url = artist.spotify;
    artistAlbum.typedName = artist.typedName;
    artistAlbum.name = artist.name;
    artistAlbum.pageNumber = this.pageNumber;
    this.artistAlbumService.artistAlbumSubject.next(artistAlbum);
  }
  trackByArtistId(index: number, artist: Artist) {
    return artist.id;
  }
}

