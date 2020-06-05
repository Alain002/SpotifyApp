import { ArtistSearchService } from './../_services/artist-search.service';
import { AlbumArtist } from './../_models/albumArtist';
import { AlertifyService } from './../_services/alertify.service';
import { Album } from './../_models/album.model';
import { ArtistAlbumsService } from './../_services/artist-albums.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Artist } from '../_models/artist.model';
import { Subscription } from 'rxjs';
import { ArtistAlbum } from '../_models/artistAlbum.model';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-artist-albums',
  templateUrl: './artist-albums.component.html',
  styleUrls: ['./artist-albums.component.css']
})
export class ArtistAlbumsComponent implements OnInit, OnDestroy {

  selectedUrl: string;
  selectedName: string;
  typedName: string;
  artistAlbums: Album[] = [];
  artists: Artist[] = [];
  showPagination = false;
  currentPage = 1;
  page: number;
  totalResult = 0;
  artistPageNumber = 0;
  routeSubscription: Subscription;
  artistAlbum: ArtistAlbum = new ArtistAlbum();
  artistAlbumSubscription: Subscription = null;

  constructor(private route: ActivatedRoute,
              private artistAlbumsService: ArtistAlbumsService,
              private router: Router,
              private alertifyService: AlertifyService, private titleService: Title,
              private artistSearchService: ArtistSearchService) { }
  ngOnInit() {
    // get albums
    this.routeSubscription = this.artistAlbumsService.artistAlbumSubject.subscribe(
      (artistAlbum) => {
        if (artistAlbum === null) {
          this.router.navigate(['/']);
        }
        this.artistAlbum = artistAlbum;
        this.selectedUrl = artistAlbum.url; // albums url
        this.selectedName = artistAlbum.name; // artist name
        this.typedName = artistAlbum.typedName; // user type artist name
        this.artistPageNumber = +artistAlbum.pageNumber; // artist page number
        this.titleService.setTitle(this.selectedName + '\'s albums');
        this.getAlbums(0);
      }
    );
  }
  ngOnDestroy(): void {
    if (this.routeSubscription !== null) {
      this.routeSubscription.unsubscribe();
    }
  }
  openAlbum(album: Album) {
    // open album
    window.open(album.spotify, '_blank');
  }
  back() {
    // back to search and send the typedName to get the same results as previous
    this.router.navigate(['/callback']);
    const albumArtist = new AlbumArtist();
    albumArtist.typedName = this.typedName;
    albumArtist.pageNumber = this.artistPageNumber;
    this.artistSearchService.albumArtistSubject.next(albumArtist);
  }
  getAlbums(offsetValue) {
    this.artistAlbums = [];
    this.artistAlbumsService.getAlbums(this.selectedUrl, offsetValue).subscribe (
      (response: any) => {
        this.artistAlbums = [];
        for (const item of response.items) {
          this.artists = [];
          const tempAlbum = new Album();
          tempAlbum.id = item.id;
          tempAlbum.name = item.name;
          tempAlbum.releaseDate = item.release_date;
          tempAlbum.totalTracks = item.total_tracks;
          tempAlbum.spotify = item.external_urls.spotify;
          if (item.images.length === 1 ) {
            tempAlbum.image = item.images.slice(0, 1).shift().url;
          } else if (item.images.length === 2) {
            tempAlbum.image = item.images.slice(1, 2).shift().url;
          } else if (item.images.length >= 3) {
            tempAlbum.image = item.images.slice(1, 2).shift().url;
          } else {
            tempAlbum.image = '';
          }
          for ( const artist of item.artists) {
            const tempArtists = new Artist();
            tempArtists.name = artist.name;
            this.artists.push(tempArtists);
          }
          tempAlbum.artists = this.artists;
          this.artistAlbums.push(tempAlbum);
        }
        this.alertifyService.success('Opening albums successfully');
        if (this.artistAlbums.length > 0) {
          this.totalResult = response.total;
          this.showPagination = true;
        } else {
          this.showPagination = false;
        }
      }, error => {
      }
    );
  }
  pageChanged(event: any): void {

    this.page = event.page;
    this.artists = new Array<Artist>();
    this.getAlbums((this.page - 1) * 20);
  }

}
