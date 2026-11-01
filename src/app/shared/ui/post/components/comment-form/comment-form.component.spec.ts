import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../../../../environments/environment';
import { CommentFormComponent } from './comment-form.component';

describe('CommentFormComponent', () => {
  let component: CommentFormComponent;
  let fixture: ComponentFixture<CommentFormComponent>;
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
      imports: [CommentFormComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(CommentFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('postId', 'post-1');
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('submits FormData to comments endpoint when commentId is omitted, resets form, and emits submitted', () => {
    const emitted: unknown[] = [];
    component.submitted.subscribe((res) => emitted.push(res));

    const testFile = new File(['img-bytes'], 'photo.png', { type: 'image/png' });
    component.content.setValue('Great post!');
    component.saveFile.set(testFile);
    component.imageUrl.set('data:image/png;base64,abc');
    fixture.detectChanges();

    const formEl: HTMLFormElement = fixture.nativeElement.querySelector('form');
    formEl.dispatchEvent(new Event('submit'));

    expect(component.sendLoading()).toBe(true);

    const req = httpMock.expectOne(`${environment.baseUrl}/posts/post-1/comments`);
    expect(req.request.method).toBe('POST');
    const body = req.request.body as FormData;
    expect(body.get('content')).toBe('Great post!');
    expect(body.get('image')).toBe(testFile);

    req.flush({ message: 'comment created' });

    expect(component.sendLoading()).toBe(false);
    expect(component.content.value).toBeNull();
    expect(component.saveFile()).toBeNull();
    expect(component.imageUrl()).toBe('');
    expect(emitted).toEqual([{ message: 'comment created' }]);
  });

  it('submits FormData to replies endpoint when commentId is provided', () => {
    fixture.componentRef.setInput('commentId', 'comment-99');
    fixture.detectChanges();

    const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
    expect(textarea.placeholder).toContain('Reply as Ahmed Ali');

    component.content.setValue('Nice reply!');
    fixture.detectChanges();

    const formEl: HTMLFormElement = fixture.nativeElement.querySelector('form');
    formEl.dispatchEvent(new Event('submit'));

    const req = httpMock.expectOne(`${environment.baseUrl}/posts/post-1/comments/comment-99/replies`);
    expect(req.request.method).toBe('POST');
    expect((req.request.body as FormData).get('content')).toBe('Nice reply!');

    req.flush({ message: 'reply created' });
    expect(component.sendLoading()).toBe(false);
  });

  it('blocks submission and shows error when content has fewer than 2 characters', () => {
    component.content.setValue('a');
    fixture.detectChanges();

    const formEl: HTMLFormElement = fixture.nativeElement.querySelector('form');
    formEl.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    httpMock.expectNone(`${environment.baseUrl}/posts/post-1/comments`);
    expect(fixture.nativeElement.textContent).toContain('must be at least 2 characters');
  });

  it('preserves typed content and resets loading state when request fails', () => {
    component.content.setValue('Keep my text');
    fixture.detectChanges();

    const formEl: HTMLFormElement = fixture.nativeElement.querySelector('form');
    formEl.dispatchEvent(new Event('submit'));

    const req = httpMock.expectOne(`${environment.baseUrl}/posts/post-1/comments`);
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });

    expect(component.sendLoading()).toBe(false);
    expect(component.content.value).toBe('Keep my text');
  });
});

