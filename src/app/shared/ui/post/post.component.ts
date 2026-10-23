import { Component, computed, inject, input, output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PostModel } from '../../../core/models/post.interface';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';
import { PostsService } from '../../../core/services/posts.service';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-post',
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
})
export class PostComponent {
  myId = signal<string>(JSON.parse(localStorage.getItem('routeUserInfo') as string)._id);
  userLoginData = signal<string>(JSON.parse(localStorage.getItem('routeUserInfo') as string));

  post = input.required<PostModel>();
  refreshPostsList = output<void>();

  // edit post variable
  editPost = signal(false);

  editContentValue: FormControl = new FormControl('');

  disableSaveEditBtn = signal(false);

  btnSaveText = computed(() => {
    return this.disableSaveEditBtn() ? 'Saving...' : 'Save';
  });

  readonly defaultAvatar = 'https://flowbite.com/docs/images/people/profile-picture-5.jpg';

  _postsService = inject(PostsService);

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
    this._postsService.deletePost(this.post()._id).subscribe({
      next: () => {
        console.info('%cPost deleted successfully', 'color: green; font-weight: bold; font-size: 20px;');
      },
      error: () => {
        console.error('Failed to delete post', 'color: red; font-weight: bold; font-size: 20px;');
      },
      complete: () => {
        this.togglePostOptions(postOptions);
        this.refreshPostsList.emit();
      },
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
    this.editContentValue.setValue(this.post().body);
    this.editPost.set(true);
  }

  submitEditPost(event: Event) {
    event.preventDefault();

    this.disableSaveEditBtn.set(true);

    const formData = new FormData();
    formData.append('body', this.editContentValue.value);
    this._postsService.updatePost(this.post()._id, formData).subscribe({
      next: () => {
        console.info('%cPost updated successfully', 'color: green; font-weight: bold; font-size: 20px;');
      },
      error: () => {
        console.error('Failed to update post', 'color: red; font-weight: bold; font-size: 20px;');
      },
      complete: () => {
        // this.refreshPostsList.emit();
        this.disableSaveEditBtn.set(false);

        this.post().body = this.editContentValue.value;
        this.editPost.set(false);
      },
    });
  }

  cancelEditPost(): void {
    this.editPost.set(false);
    this.editContentValue.reset();
  }
}
