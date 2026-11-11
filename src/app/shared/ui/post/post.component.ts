import { Component, computed, inject, input, linkedSignal, output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PostModel } from '../../../core/models/post.interface';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';
import { PostsService } from '../../../core/services/posts.service';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { LucideBookmark, LucideChevronDown, LucideEarth, LucideEllipsis, LucideLock, LucideMessageCircle, LucideRepeat2, LucideShare2, LucideThumbsUp, LucideUsers } from '@lucide/angular';
import { SharedPostComponent } from './components/shared-post/shared-post.component';
import { PostPrivacy } from '../../../core/enums/post-privacy.enum';
import { Router, RouterLink } from '@angular/router';
import { PostLikesComponent } from './components/post-likes/post-likes.component';
import { ModalComponent } from '../modal/modal.component';
import { SharePostModalComponent } from './components/share-post-modal/share-post-modal.component';
import { initDropdowns } from 'flowbite';
import { PostCommentsComponent } from './components/post-comments/post-comments.component';

@Component({
  selector: 'app-post',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    LucideMessageCircle,
    LucideShare2,
    LucideBookmark,
    LucideThumbsUp,
    LucideRepeat2,
    TimeAgoPipe,
    LucideUsers,
    LucideLock,
    LucideEllipsis,
    LucideEarth,
    LucideChevronDown,
    SharedPostComponent,
    PostLikesComponent,
    ModalComponent,
    SharePostModalComponent,
    PostCommentsComponent,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
})
export class PostComponent {
  //
  _postsService = inject(PostsService);
  _router = inject(Router);

  myId = signal<string>(JSON.parse(localStorage.getItem('routeUserInfo') as string)._id);
  userLoginData = signal<string>(JSON.parse(localStorage.getItem('routeUserInfo') as string));
  postPrivacyEnum = PostPrivacy;

  // signal to update like button when user like post
  readonly defaultAvatar = 'https://flowbite.com/docs/images/people/profile-picture-5.jpg';

  post = input.required<PostModel>();
  localPost = linkedSignal(() => this.post());

  refreshPostsList = output<void>();

  // form
  editContentValue: FormControl = new FormControl('');

  // signals
  editPost = signal(false);
  disableSaveEditBtn = signal(false);
  disablePrivacyBtn = signal(false);
  isLiking = signal(false);

  showComments = signal(false);

  userLikedPost = computed(() => this.localPost().likes.includes(this.myId()));
  isBookmarkedPost = linkedSignal(() => this.localPost().bookmarked);
  loadingBookmarkPostStatus = signal(false);

  // modal
  isModalOpen = signal(false);

  modalType = signal<'likesModal' | 'shareModal'>('shareModal');

  // computed
  btnSaveText = computed(() => {
    return this.disableSaveEditBtn() ? 'Saving...' : 'Save';
  });

  ngAfterViewInit(): void {
    initDropdowns();
  }

  toggleShowComments() {
    this.showComments.set(!this.showComments());
  }

  refreshFeed(): void {
    this.refreshPostsList.emit();
  }

  routeToUserProfile(): void {
    const userId = this.localPost().user._id;
    if (this.myId() === userId) {
      this._router.navigate(['/profile']);
      return;
    }
    this._router.navigate(['/profile', userId]);
  }

  // modal Functions
  openModal(modalType: 'likesModal' | 'shareModal') {
    this.modalType.set(modalType);
    if (modalType === 'likesModal') {
      if (this.post().likesCount == 0) return;
    }
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  deletePostFromParent() {
    this._postsService.deletePost(this.localPost()._id).subscribe({
      next: () => {
        console.info('%cPost deleted successfully', 'color: green; font-weight: bold; font-size: 20px;');
        this.refreshFeed();
      },
      error: () => console.error('Failed to delete post', 'color: red; font-weight: bold; font-size: 20px;'),
    });
  }

  //! Edit post
  openEditPost() {
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
  toggleBookmarkPost(): void {
    this.loadingBookmarkPostStatus.set(true);
    this._postsService.bookmarkPost(this.localPost()._id).subscribe({
      next: () => {
        this.localPost.update((post) => ({
          ...post,
          bookmarked: !post.bookmarked,
        }));

        this.isBookmarkedPost.set(!this.isBookmarkedPost());

        this.loadingBookmarkPostStatus.set(false);
      },
      error: (err) => {
        console.error('Failed to toggle like:', err);
        this.loadingBookmarkPostStatus.set(false);
      },
    });
  }

  // Edit My Post Privacy
  updatePostPrivacy(privacy: string) {
    if (this.localPost().privacy === privacy) {
      return;
    }

    const newPrivacy = { privacy: privacy };
    this.localPost.update((post) => ({ ...post, privacy }));
    this.disablePrivacyBtn.set(true);
    this._postsService.updatePost(this.localPost()._id, newPrivacy).subscribe({
      next: () => {
        console.info('%cPost privacy updated successfully', 'color: green; font-weight: bold; font-size: 20px;');
        this.disablePrivacyBtn.set(false);
      },
      error: (err) => {
        console.error('Failed to update post privacy:', err);
        this.disablePrivacyBtn.set(false);
      },
    });
  }
}
