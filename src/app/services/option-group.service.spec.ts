import { TestBed } from '@angular/core/testing';

import { OptionGroupService } from './option-group.service';

describe('OptionGroupService', () => {
  let service: OptionGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OptionGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
