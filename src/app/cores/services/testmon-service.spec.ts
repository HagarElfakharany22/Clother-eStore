import { TestBed } from '@angular/core/testing';

import { TestmonService } from './testmon-service';

describe('TestmonService', () => {
  let service: TestmonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestmonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
