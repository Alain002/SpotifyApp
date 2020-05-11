/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ArtistSearchService } from './artist-search.service';

describe('Service: ArtistSearch', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArtistSearchService]
    });
  });

  it('should ...', inject([ArtistSearchService], (service: ArtistSearchService) => {
    expect(service).toBeTruthy();
  }));
});
