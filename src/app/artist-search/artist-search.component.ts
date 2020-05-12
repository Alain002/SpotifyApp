import { Artist } from './../_models/artist.model';
import { ArtistSearchService } from './../_services/artist-search.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-artist-search',
  templateUrl: './artist-search.component.html',
  styleUrls: ['./artist-search.component.css']
})
export class ArtistSearchComponent implements OnInit {

  spotifyToken: any;
  artistSearchValue = '';
  artistSearchOldValue = '';
  artists: Artist[] = [];
  notFound = false;
  model: any  = {

  };
  getDataSubscription: Subscription;
  routeSubscription: Subscription;
  selectedName = '';
  constructor(private route: ActivatedRoute,
              private artistSearchService: ArtistSearchService,
              private router: Router) { }
  ngOnInit() {
    // get data from the response
    // save the token in the localstorage
    // check if selected name is null, used for back button in the album component
    if ( localStorage.getItem('access_token') === null) {
      this.routeSubscription = this.route.fragment
        .pipe(
          map(fragment => new URLSearchParams(fragment)),
          map(params => ({
            access_token: params.get('access_token'),
            token_type: params.get('token_type'),
            expires_in: params.get('expires_in'),
            state: params.get('state'),
          }))
    )
    .subscribe(res => localStorage.setItem('access_token', res.access_token));
      this.route.paramMap.subscribe(
      params => {
        this.selectedName = params.get('typedName');
        if (this.selectedName != null) {
          if (this.selectedName.trim().length > 0) {
            this.model.artistName = this.selectedName;
            this.searchArtist();
          }
        }
    });
  }
}
  // search for artist on change
  search(event: any) {
    this.notFound = false;
    this.getDataSubscription = this.artistSearchValue = event.target.value;
    if ( this.artistSearchValue.trim().length > 0 && this.artistSearchOldValue !== this.artistSearchValue) {
      this.artists = [];
      this.artistSearchOldValue  = this.artistSearchValue;
      this.artistSearchService.search(this.artistSearchValue).subscribe(
        (response: any) => {
          if (response.artists.items.length > 0) {
            for (const item of response.artists.items) {
              const tempArtist = new Artist();
              tempArtist.id = item.id;
              tempArtist.followers = item.followers.total;
              // if the image is big, the loading time will be higher.
              if (item.images.length === 1 ) {
                tempArtist.image = item.images.slice(0, 1).shift().url;
              } else if (item.images.length === 2) {
                tempArtist.image = item.images.slice(1, 2).shift().url;
              } else if (item.images.length >= 3) {
                tempArtist.image = item.images.slice(2, 3).shift().url;
              } else {
                tempArtist.image = '';
              }

              tempArtist.popularity = item.popularity;
              // rating is from 0 to 100 -> /20 becomes from 0 to 5
              tempArtist.rating = tempArtist.popularity / 20;
              tempArtist.name = item.name;
              tempArtist.spotify = item.href;
              tempArtist.typedName = this.artistSearchValue;
              this.artists.push(tempArtist);
            }
          } else {
            this.notFound = true;
          }

        }, error => {
          this.router.navigate(['/error-page']);
        }
      );
    }
    // behavior subject to send data to the service and then display them
    this.artistSearchService.artistsSubject.next(this.artists);
  }
  // on search button clicked
  searchArtist() {
    this.getDataSubscription = this.artistSearchValue = this.model.artistName;
    if ( this.artistSearchValue.trim().length > 0 && this.artistSearchOldValue !== this.artistSearchValue) {
      this.artists = [];
      this.artistSearchOldValue  = this.artistSearchValue;
      this.artistSearchService.search(this.artistSearchValue).subscribe(
        (response: any) => {
          for (const item of response.artists.items) {
            const tempArtist = new Artist();
            tempArtist.id = item.id;
            tempArtist.followers = item.followers.total;
            if (item.images.length === 1 ) {
              tempArtist.image = item.images.slice(0, 1).shift().url;
            } else if (item.images.length === 2) {
              tempArtist.image = item.images.slice(1, 2).shift().url;
            } else if (item.images.length >= 3) {
              tempArtist.image = item.images.slice(2, 3).shift().url;
            } else {
              tempArtist.image = '';
            }
            tempArtist.popularity = item.popularity;
            tempArtist.rating = tempArtist.popularity / 20;
            tempArtist.name = item.name;
            tempArtist.spotify = item.href;
            tempArtist.typedName = this.artistSearchValue;
            this.artists.push(tempArtist);
          }
        }, error => {
          this.router.navigate(['/error-page']);
        }
      );
    }
    this.artistSearchService.artistsSubject.next(this.artists);
  }
}
