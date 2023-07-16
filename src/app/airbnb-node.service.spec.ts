import { TestBed } from '@angular/core/testing';

import { AirbnbNodeService } from './airbnb-node.service';

describe('AirbnbNodeService', () => {
  let service: AirbnbNodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AirbnbNodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
