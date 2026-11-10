import { TestBed } from '@angular/core/testing';

import { ModalFlowbiteService } from './modal-flowbite.service';

describe('ModalFlowbiteService', () => {
  let service: ModalFlowbiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalFlowbiteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
