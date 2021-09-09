/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WordImageService } from './wordImage.service';

describe('Service: WordImage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WordImageService]
    });
  });

  it('should ...', inject([WordImageService], (service: WordImageService) => {
    expect(service).toBeTruthy();
  }));
});
