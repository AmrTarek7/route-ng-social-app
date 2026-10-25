import { Component, computed, inject, input, linkedSignal, output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PostModel } from '../../../core/models/post.interface';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';
import { PostsService } from '../../../core/services/posts.service';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { LucideBookmark } from '@lucide/angular';

@Component({
  selector: 'app-post',
  imports: [DatePipe, ReactiveFormsModule, LucideBookmark],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
})
export class PostComponent {
  _postsService = inject(PostsService);

  myId = signal<string>(JSON.parse(localStorage.getItem('routeUserInfo') as string)._id);
  userLoginData = signal<string>(JSON.parse(localStorage.getItem('routeUserInfo') as string));

  // signal to update like button when user like post

  readonly defaultAvatar = 'https://flowbite.com/docs/images/people/profile-picture-5.jpg';

  post = input.required<PostModel>();

  refreshPostsList = output<void>();

  // form
  editContentValue: FormControl = new FormControl('');

  // signals
  editPost = signal(false);
  disableSaveEditBtn = signal(false);

  localPost = linkedSignal(() => this.post());

  userLikedPost = computed(() => this.localPost().likes.includes(this.myId()));
  isLiking = signal(false);

  isBookmarkedPost = linkedSignal(() => this.localPost().bookmarked);
  // computed
  btnSaveText = computed(() => {
    return this.disableSaveEditBtn() ? 'Saving...' : 'Save';
  });

  // Hide & Show User Menu
  togglePostOptions(element: HTMLElement | HTMLInputElement): void {
    //
    if (element.classList.contains('hidden')) {
      element.classList.remove('hidden');
    } else {
      element.classList.add('hidden');
    }
  }

  deletePostFromParent(postOptions: HTMLElement | HTMLInputElement) {
    this._postsService.deletePost(this.localPost()._id).subscribe({
      next: () => {
        console.info('%cPost deleted successfully', 'color: green; font-weight: bold; font-size: 20px;');
        this.togglePostOptions(postOptions);
        this.refreshPostsList.emit();
      },
      error: () => console.error('Failed to delete post', 'color: red; font-weight: bold; font-size: 20px;'),
    });
  }

  onImageError(event: Event, fallback: string = this.defaultAvatar): void {
    const target = event.target as HTMLImageElement;
    if (target && target.src !== fallback) {
      target.src = fallback;
    }
  }

  openEditPost(postOptions: HTMLElement | HTMLInputElement) {
    this.togglePostOptions(postOptions);
    this.editContentValue.setValue(this.localPost().body);
    this.editPost.set(true);
  }

  submitEditPost(event: Event) {
    event.preventDefault();

    this.disableSaveEditBtn.set(true);

    const formData = new FormData();
    formData.append('body', this.editContentValue.value);
    this._postsService.updatePost(this.localPost()._id, formData).subscribe({
      next: () => {
        console.info('%cPost updated successfully', 'color: green; font-weight: bold; font-size: 20px;');
        this.disableSaveEditBtn.set(false);
        this.editPost.set(false);
        this.localPost.update((post) => ({ ...post, body: this.editContentValue.value }));
      },
      error: () => console.error('Failed to update post', 'color: red; font-weight: bold; font-size: 20px;'),
    });
  }

  cancelEditPost(): void {
    this.editPost.set(false);
    this.editContentValue.reset();
  }

  //! Like & Unlike Post
  toggleLikePost(): void {
    if (this.isLiking()) return;

    this.isLiking.set(true);

    this._postsService.likePost(this.localPost()._id).subscribe({
      next: () => {
        this.localPost.update((post) => ({
          ...post,
          likes: this.userLikedPost() ? post.likes.filter((id) => id !== this.myId()) : [...post.likes, this.myId()],
          likesCount: this.userLikedPost() ? Math.max(0, post.likesCount - 1) : post.likesCount + 1,
        }));

        this.isLiking.set(false);
      },
      error: (err) => {
        console.error('Failed to toggle like:', err);
      },
    });
  }

  //! Bookmark and Unbookmark Post
  toggleBookmarkPost(postOptions: HTMLElement | HTMLInputElement): void {
    this.togglePostOptions(postOptions);
    this._postsService.bookmarkPost(this.localPost()._id).subscribe({
      next: () => {
        this.localPost.update((post) => ({
          ...post,
          bookmarked: !post.bookmarked,
        }));

        this.isBookmarkedPost.set(!this.isBookmarkedPost());
      },
      error: (err) => {
        console.error('Failed to toggle like:', err);
      },
    });
  }
}
