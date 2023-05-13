import { TestBed } from '@angular/core/testing';

import { KeresesService } from './kereses.service';

describe('KeresesService', () => {
  let service: KeresesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeresesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
