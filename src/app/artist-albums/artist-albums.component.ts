import { AlertifyService } from './../_services/alertify.service';
import { Album } from './../_models/album.model';
import { ArtistAlbumsService } from './../_services/artist-albums.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Artist } from '../_models/artist.model';
import { Subscription } from 'rxjs';

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

  constructor(private route: ActivatedRoute,
              private artistAlbumsService: ArtistAlbumsService,
              private router: Router,
              private alertifyService: AlertifyService) { }
  ngOnInit() {
    // get albums
    this.routeSubscription = this.route.paramMap.subscribe(
      params => {
        this.selectedUrl = params.get('url'); // albums url
        this.selectedName = params.get('name'); // artist name
        this.typedName = params.get('typedName'); // user type artist name
        this.artistPageNumber = +params.get('pageNumber'); // artist page number
        this.getAlbums(0);
      }
    );
  }
  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }
  openAlbum(album: Album) {
    // open album
    window.open(album.spotify, '_blank');
  }
  back() {
    // back to search and send the typedName to get the same results as previous
    this.router.navigate(['/callback', { typedName: this.typedName, pageNumber: this.artistPageNumber}]);
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
