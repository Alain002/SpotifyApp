/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ArtistAlbumsService } from './artist-albums.service';

describe('Service: ArtistAlbums', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArtistAlbumsService]
    });
  });

  it('should ...', inject([ArtistAlbumsService], (service: ArtistAlbumsService) => {
    expect(service).toBeTruthy();
  }));
});
