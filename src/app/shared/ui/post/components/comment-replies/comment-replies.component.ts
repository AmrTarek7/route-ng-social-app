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

  myId = signal<string>(JSON.parse(localStorage.getItem('routeUserInfo') as string)?._id ?? '');

  postId = input.required<string>();
  commentId = input.required<string>();

  replyCreated = output<void>();

  replies = signal<CommentReplyIF[]>([]);
  meta = signal<Meta | null>(null);
  loading = signal(false);
  loadingMore = signal(false);
  likingReplyIds = signal<Record<string, boolean>>({});

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

  isReplyLiking(replyId: string): boolean {
    return !!this.likingReplyIds()[replyId];
  }

  isReplyLiked(reply: CommentReplyIF): boolean {
    return reply.likes.includes(this.myId());
  }

  likeReply(replyId: string): void {
    if (this.isReplyLiking(replyId)) return;

    this.likingReplyIds.update((prev) => ({ ...prev, [replyId]: true }));

    this._commentsAndRepliesService.likeComment(this.postId(), replyId).subscribe({
      next: () => {
        const currentUserId = this.myId();
        this.replies.update((prev) =>
          prev.map((reply) => {
            if (reply._id !== replyId) return reply;
            const alreadyLiked = reply.likes.includes(currentUserId);
            const updatedLikes = alreadyLiked ? reply.likes.filter((id) => id !== currentUserId) : [...reply.likes, currentUserId];
            return {
              ...reply,
              likes: updatedLikes,
              likesCount: updatedLikes.length,
            };
          }),
        );
        this.likingReplyIds.update((prev) => ({ ...prev, [replyId]: false }));
      },
      error: (err) => {
        console.error('Failed to toggle reply like:', err);
        this.likingReplyIds.update((prev) => ({ ...prev, [replyId]: false }));
      },
    });
  }
}
