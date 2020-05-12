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
  routeSubscription: Subscription;
  constructor(private route: ActivatedRoute,
              private artistAlbumsService: ArtistAlbumsService,
              private router: Router) { }
  ngOnInit() {
    // get albums
    this.routeSubscription = this.route.paramMap.subscribe(
      params => {
        this.selectedUrl = params.get('url');
        this.selectedName = params.get('name');
        this.typedName = params.get('typedName');
        this.artistAlbumsService.getAlbums(this.selectedUrl).subscribe (
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
                tempAlbum.image = item.images.slice(2, 3).shift().url;
              } else {
                tempAlbum.image = '';
              }
              // tempAlbum.image = item.images.slice(1, 2).shift().url;
              for ( const artist of item.artists) {
                const tempArtists = new Artist();
                tempArtists.name = artist.name;
                this.artists.push(tempArtists);
              }
              tempAlbum.artists = this.artists;
              this.artistAlbums.push(tempAlbum);
            }
          }, error => {
            this.router.navigate(['/error-page']);
          }
        );
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
    this.router.navigate(['/callback', { typedName: this.typedName}]);
  }

}
