import { TestBed } from '@angular/core/testing';

import { CommentsAndRepliesService } from './comments-and-replies.service';

describe('CommentsAndRepliesService', () => {
  let service: CommentsAndRepliesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentsAndRepliesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
