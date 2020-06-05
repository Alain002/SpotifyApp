import { AlbumArtist } from './../_models/albumArtist';
import { AlertifyService } from './../_services/alertify.service';
import { Artist } from './../_models/artist.model';
import { ArtistSearchService } from './../_services/artist-search.service';
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-artist-search',
  templateUrl: './artist-search.component.html',
  styleUrls: ['./artist-search.component.css']
})
export class ArtistSearchComponent implements OnInit, OnDestroy {

  @Output() resultFound = new EventEmitter();
  spotifyToken: any;
  artistSearchValue = '';
  artistSearchOldValue = '';
  artists: Artist[] = [];
  notFound = false;
  model: any  = {

  };
  getDataSubscription: Subscription = null;
  routeSubscription: Subscription = null;
  albumArtistSubscription: Subscription = null;
  currentPage = 1;
  page = 1;
  showPagination = false;
  totalResult = 0;
  albumArtist = new AlbumArtist();

  constructor(private route: ActivatedRoute,
              private artistSearchService: ArtistSearchService,
              private router: Router,
              private alertifyService: AlertifyService,
              private titleService: Title) { }
  ngOnInit() {
    this.titleService.setTitle('Search for Artists...');
      // get data from the response
      // save the token in the localstorage
      // check if selected name is null, used for back button in the album component
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
      .subscribe(res => {
        if (res.access_token != null && localStorage.getItem('access_token') !== res.access_token) {
          localStorage.setItem('access_token', res.access_token);
          this.alertifyService.success('login successful');
        }
      });
    this.albumArtistSubscription = this.artistSearchService.albumArtistSubject.subscribe(
        (albumArtist) => {
          if (albumArtist !== null) {
            this.albumArtist = albumArtist;
            this.artistSearchValue = albumArtist.typedName;
            this.page = albumArtist.pageNumber;
            if (this.artistSearchValue != null) {
              if (this.artistSearchValue.trim().length > 0) {
                this.alertifyService.message('showing artists');
                this.model.artistName = this.artistSearchValue;
                this.currentPage = this.page;
                this.getArtists(this.artistSearchValue, (this.page - 1) * 20);
              }
            }
          }
        }
      );
  }
  ngOnDestroy() {
    if (this.routeSubscription !== null) {
      this.routeSubscription.unsubscribe();
    }
    if (this.getDataSubscription !== null) {
      this.getDataSubscription.unsubscribe();
    }
    if (this.albumArtistSubscription !== null) {
      this.albumArtistSubscription.unsubscribe();
    }
  }
  // search for artist on change
  search(event: any) {
    this.notFound = false;
    this.artistSearchValue = event.target.value;
    if ( this.artistSearchValue.trim().length > 0 && this.artistSearchOldValue !== this.artistSearchValue) {
      this.artists = [];
      this.artistSearchOldValue  = this.artistSearchValue;
      this.getArtists(this.artistSearchValue, 0);
    }
  }
  // on search button clicked
  searchArtist() {
    this.artistSearchValue = this.model.artistName;
    if ( this.artistSearchValue.trim().length > 0 && this.artistSearchOldValue !== this.artistSearchValue) {
      this.artists = [];
      this.artistSearchOldValue  = this.artistSearchValue;
      this.getArtists(this.artistSearchValue, 0);
    }
  }
  getArtists(artistSearchValue: string, pageNumber: number) {
    this.getDataSubscription = this.artistSearchService.search(artistSearchValue, pageNumber).subscribe(
      (response: any) => {
        this.totalResult = response.artists.total;
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
        if (this.artists.length > 0) {
          this.showPagination = true;
        } else {
          this.showPagination = false;
        }
        this.artistSearchService.artistsSubject.next(this.artists);
      }, error => {
      }
    );
  }
  pageChanged(event: any): void {
    this.page = event.page;
    this.artists = new Array<Artist>();
    this.getArtists(this.artistSearchValue, (this.page - 1) * 20);
    this.artistSearchService.pageNumberSubject.next(this.page);
  }
}
