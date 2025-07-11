import { TestBed } from '@angular/core/testing';

import { TransitRealtimeDataService } from './transit-realtime-data-service';

describe('TransitRealtimeDataService', () => {
  let service: TransitRealtimeDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransitRealtimeDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
