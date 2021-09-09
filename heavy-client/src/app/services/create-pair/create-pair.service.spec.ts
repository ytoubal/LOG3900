import { TestBed } from '@angular/core/testing';

import { CreatePairService } from './create-pair.service';

describe('CreatePairService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreatePairService = TestBed.get(CreatePairService);
    expect(service).toBeTruthy();
  });
});
