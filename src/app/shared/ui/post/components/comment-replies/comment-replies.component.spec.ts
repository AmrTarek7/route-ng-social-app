import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { environment } from '../../../../../../environments/environment';
import { CommentFormComponent } from '../comment-form/comment-form.component';
import { CommentRepliesComponent } from './comment-replies.component';

describe('CommentRepliesComponent', () => {
  let component: CommentRepliesComponent;
  let fixture: ComponentFixture<CommentRepliesComponent>;
  let httpMock: HttpTestingController;

  const mockReply = (id: string, content: string) => ({
    _id: id,
    id,
    content,
    commentCreator: {
      _id: 'user-2',
      id: 'user-2',
      name: 'Sara Mohamed',
      username: 'sara',
      photo: 'https://example.com/sara.jpg',
      followersCount: 5,
      followingCount: 3,
      bookmarksCount: 1,
    },
    post: 'post-10',
    parentComment: 'comment-20',
    likes: [],
    createdAt: new Date().toISOString(),
    likesCount: 0,
    isReply: true,
  });

  beforeEach(async () => {
    localStorage.setItem(
      'routeUserInfo',
      JSON.stringify({
        _id: 'user-1',
        name: 'Ahmed Ali',
        username: 'ahmed',
        email: 'ahmed@test.com',
        photo: 'https://example.com/avatar.jpg',
        cover: null,
      }),
    );

    await TestBed.configureTestingModule({
      imports: [CommentRepliesComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(CommentRepliesComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('postId', 'post-10');
    fixture.componentRef.setInput('commentId', 'comment-20');
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('fetches and renders comment replies on init, and submits a new reply via app-comment-form', () => {
    let emittedCount = 0;
    component.replyCreated.subscribe(() => emittedCount++);

    const initialGet = httpMock.expectOne(
      (r) =>
        r.method === 'GET' &&
        r.url === `${environment.baseUrl}/posts/post-10/comments/comment-20/replies` &&
        r.params.get('page') === '1',
    );
    initialGet.flush({
      data: { replies: [mockReply('r-1', 'Existing reply')] },
      meta: { pagination: { currentPage: 1, numberOfPages: 1, limit: 10, total: 1 } },
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Existing reply');

    const replyFormDebug = fixture.debugElement.query(By.directive(CommentFormComponent));
    expect(replyFormDebug).toBeTruthy();

    const replyForm = replyFormDebug.componentInstance as CommentFormComponent;
    replyForm.content.setValue('New reply!');
    fixture.detectChanges();

    const formEl: HTMLFormElement = replyFormDebug.nativeElement.querySelector('form');
    formEl.dispatchEvent(new Event('submit'));

    const postReq = httpMock.expectOne(`${environment.baseUrl}/posts/post-10/comments/comment-20/replies`);
    expect(postReq.request.method).toBe('POST');
    expect((postReq.request.body as FormData).get('content')).toBe('New reply!');
    postReq.flush({ message: 'reply created' });

    expect(emittedCount).toBe(1);

    const refreshGet = httpMock.expectOne(
      (r) => r.method === 'GET' && r.url === `${environment.baseUrl}/posts/post-10/comments/comment-20/replies`,
    );
    refreshGet.flush({
      data: {
        replies: [mockReply('r-1', 'Existing reply'), mockReply('r-2', 'New reply!')],
      },
      meta: { pagination: { currentPage: 1, numberOfPages: 1, limit: 10, total: 2 } },
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('New reply!');
    expect(component.replies().length).toBe(2);
  });

  it('loads and appends next page of replies when View more replies is clicked', () => {
    const page1Get = httpMock.expectOne(
      (r) =>
        r.method === 'GET' &&
        r.url === `${environment.baseUrl}/posts/post-10/comments/comment-20/replies` &&
        r.params.get('page') === '1',
    );
    page1Get.flush({
      data: { replies: [mockReply('r-1', 'Reply page 1')] },
      meta: { pagination: { currentPage: 1, numberOfPages: 2, limit: 10, total: 11 } },
    });
    fixture.detectChanges();

    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    const loadMoreBtn = buttons.find((b) => b.textContent?.includes('View more replies'));
    expect(loadMoreBtn).toBeTruthy();

    loadMoreBtn!.click();

    const page2Get = httpMock.expectOne(
      (r) =>
        r.method === 'GET' &&
        r.url === `${environment.baseUrl}/posts/post-10/comments/comment-20/replies` &&
        r.params.get('page') === '2',
    );
    page2Get.flush({
      data: { replies: [mockReply('r-2', 'Reply page 2')] },
      meta: { pagination: { currentPage: 2, numberOfPages: 2, limit: 10, total: 11 } },
    });
    fixture.detectChanges();

    expect(component.replies().length).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('Reply page 1');
    expect(fixture.nativeElement.textContent).toContain('Reply page 2');
  });
});

