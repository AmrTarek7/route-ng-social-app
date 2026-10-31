import { FeedComponent } from './../../../../../features/feed/feed.component';
import { Component, computed, inject, input, output, signal, ViewChild } from '@angular/core';
import { Pagination } from '../../../../../core/models/meta-res.interface';
import { PostsService } from '../../../../../core/services/posts.service';
import { Likes } from '../../../../../core/models/likes.interface';
import { PostModel, SharedPost } from '../../../../../core/models/post.interface';
import { LucideX } from '@lucide/angular';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-share-post-modal',
  imports: [LucideX, ReactiveFormsModule],
  templateUrl: './share-post-modal.component.html',
  styleUrl: './share-post-modal.component.css',
})
export class SharePostModalComponent {
  closeModal = output<void>();
  shareSuccess = output<void>();

  post = input.required<PostModel | SharedPost>();

  _postsService = inject(PostsService);

  content: FormControl = new FormControl('');

  disableBtns = signal(false);
  shareBtnText = computed(() => (this.disableBtns() ? 'Sharing...' : 'Share now'));

  ngOnInit(): void {}

  closeShareModal(): void {
    this.closeModal.emit();
  }

  submitSharePost(e: Event): void {
    e.preventDefault();

    this.disableBtns.set(true);

    const body = this.content.value ? { body: `${this.content.value}` } : '';

    this._postsService.sharePost(this.post()._id, body).subscribe({
      next: () => {
        console.log(`post shared successfully`);

        this.disableBtns.set(false);

        this.closeShareModal();

        this.shareSuccess.emit();
      },
      error: (err) => {
        console.log(`failed to share post`, err);
        this.disableBtns.set(true);
        this.closeShareModal();
      },
    });
  }
}
