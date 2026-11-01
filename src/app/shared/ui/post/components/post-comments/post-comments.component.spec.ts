import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';
import { environment } from '../../../../../../environments/environment';
import { CommentFormComponent } from '../comment-form/comment-form.component';
import { CommentRepliesComponent } from '../comment-replies/comment-replies.component';
import { PostCommentsComponent } from './post-comments.component';

describe('PostCommentsComponent', () => {
  let component: PostCommentsComponent;
  let fixture: ComponentFixture<PostCommentsComponent>;
  let httpMock: HttpTestingController;

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
      imports: [PostCommentsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(PostCommentsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('postId', 'post-42');
    fixture.componentRef.setInput('commentsCount', 1);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
    httpMock.verify();
    localStorage.clear();
  });

  it('renders app-comment-form and refreshes comments list when a new comment is submitted', () => {
    const initialGet = httpMock.expectOne(
      (r) => r.method === 'GET' && r.url === `${environment.baseUrl}/posts/post-42/comments`,
    );
    initialGet.flush({
      data: { comments: [] },
      meta: { pagination: { currentPage: 1, numberOfPages: 1, limit: 10, total: 0 } },
    });
    fixture.detectChanges();

    const commentFormDebug = fixture.debugElement.query(By.directive(CommentFormComponent));
    expect(commentFormDebug).toBeTruthy();

    const commentForm = commentFormDebug.componentInstance as CommentFormComponent;
    commentForm.content.setValue('First comment!');
    fixture.detectChanges();

    const formEl: HTMLFormElement = commentFormDebug.nativeElement.querySelector('form');
    formEl.dispatchEvent(new Event('submit'));

    const postReq = httpMock.expectOne(`${environment.baseUrl}/posts/post-42/comments`);
    expect(postReq.request.method).toBe('POST');
    postReq.flush({ message: 'created' });

    const refreshGet = httpMock.expectOne(
      (r) => r.method === 'GET' && r.url === `${environment.baseUrl}/posts/post-42/comments`,
    );
    refreshGet.flush({
      data: {
        comments: [
          {
            _id: 'c-1',
            content: 'First comment!',
            commentCreator: {
              _id: 'user-1',
              name: 'Ahmed Ali',
              username: 'ahmed',
              photo: 'https://example.com/avatar.jpg',
            },
            post: 'post-42',
            parentComment: null,
            likes: [],
            createdAt: new Date().toISOString(),
            repliesCount: 0,
          },
        ],
      },
      meta: { pagination: { currentPage: 1, numberOfPages: 1, limit: 10, total: 1 } },
    });

    expect(component.comments().length).toBe(1);
    expect(component.comments()[0].content).toBe('First comment!');
  });

  it('toggles comment replies section on Reply click and increments repliesCount when replyCreated fires', () => {
    vi.useFakeTimers();

    const initialGet = httpMock.expectOne(
      (r) => r.method === 'GET' && r.url === `${environment.baseUrl}/posts/post-42/comments`,
    );
    initialGet.flush({
      data: {
        comments: [
          {
            _id: 'c-100',
            content: 'Parent comment',
            commentCreator: {
              _id: 'user-2',
              name: 'Mona',
              username: 'mona',
              photo: 'https://example.com/mona.jpg',
            },
            post: 'post-42',
            parentComment: null,
            likes: [],
            createdAt: new Date().toISOString(),
            repliesCount: 2,
          },
        ],
      },
      meta: { pagination: { currentPage: 1, numberOfPages: 1, limit: 10, total: 1 } },
    });

    vi.advanceTimersByTime(600);
    fixture.detectChanges();

    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    const replyBtn = buttons.find((b) => b.textContent?.includes('Reply'));
    expect(replyBtn).toBeTruthy();
    expect(replyBtn!.textContent).toContain('Reply (2)');

    replyBtn!.click();
    fixture.detectChanges();

    const repliesGet = httpMock.expectOne(
      (r) => r.method === 'GET' && r.url === `${environment.baseUrl}/posts/post-42/comments/c-100/replies`,
    );
    repliesGet.flush({
      data: { replies: [] },
      meta: { pagination: { currentPage: 1, numberOfPages: 1, limit: 10, total: 0 } },
    });
    fixture.detectChanges();

    const repliesDebug = fixture.debugElement.query(By.directive(CommentRepliesComponent));
    expect(repliesDebug).toBeTruthy();

    const repliesComp = repliesDebug.componentInstance as CommentRepliesComponent;
    repliesComp.replyCreated.emit();
    fixture.detectChanges();

    expect(component.comments()[0].repliesCount).toBe(3);
  });
});
