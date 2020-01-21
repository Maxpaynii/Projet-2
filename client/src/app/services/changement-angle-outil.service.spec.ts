import { TestBed } from '@angular/core/testing';

import { ChangementAngleOutilService } from './changement-angle-outil.service';

describe('ChangementAngleOutilService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChangementAngleOutilService = TestBed.get(ChangementAngleOutilService);
    expect(service).toBeTruthy();
  });
});
