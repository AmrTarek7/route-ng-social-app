import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { CommentReplyIF } from '../../../../../core/models/comment-replay.interface';
import { Meta } from '../../../../../core/models/meta-res.interface';
import { CommentsAndRepliesService } from '../../../../../core/services/comments-and-replies.service';
import { TimeAgoPipe } from '../../../../pipes/time-ago.pipe';
import { CommentFormComponent } from '../comment-form/comment-form.component';

@Component({
  selector: 'app-comment-replies',
  imports: [TimeAgoPipe, CommentFormComponent],
  templateUrl: './comment-replies.component.html',
  styleUrl: './comment-replies.component.css',
})
export class CommentRepliesComponent implements OnInit {
  private readonly _commentsAndRepliesService = inject(CommentsAndRepliesService);

  readonly defaultAvatar = 'https://flowbite.com/docs/images/people/profile-picture-5.jpg';

  postId = input.required<string>();
  commentId = input.required<string>();

  replyCreated = output<void>();

  replies = signal<CommentReplyIF[]>([]);
  meta = signal<Meta | null>(null);
  loading = signal(false);
  loadingMore = signal(false);

  hasNextPage = computed(() => {
    const currentMeta = this.meta();
    return !!currentMeta && currentMeta.pagination.currentPage < currentMeta.pagination.numberOfPages;
  });

  ngOnInit(): void {
    this.getCommentReplies();
  }

  getCommentReplies(): void {
    this.loading.set(true);
    this._commentsAndRepliesService.getAllCommentReplies(this.postId(), this.commentId()).subscribe({
      next: (res) => {
        this.replies.set(res.data?.replies);
        this.meta.set(res.meta ?? null);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  loadMoreReplies(): void {
    const currentMeta = this.meta();
    if (!currentMeta || this.loadingMore()) return;

    const nextPage = currentMeta.pagination.currentPage + 1;
    if (nextPage > currentMeta.pagination.numberOfPages) return;

    this.loadingMore.set(true);
    this._commentsAndRepliesService.getAllCommentReplies(this.postId(), this.commentId(), currentMeta.pagination.limit || 10, nextPage).subscribe({
      next: (res) => {
        this.replies.update((prev) => [...prev, ...res.data?.replies]);
        this.meta.set(res.meta ?? null);
        this.loadingMore.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loadingMore.set(false);
      },
    });
  }

  onReplySubmitted(e: any): void {
    this.replyCreated.emit();
    this.getCommentReplies();

    // console.log('res from FormComment to replies', e);
  }
}
