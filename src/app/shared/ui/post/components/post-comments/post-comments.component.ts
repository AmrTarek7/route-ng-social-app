import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { CommentIF } from '../../../../../core/models/comment.interface';
import { TimeAgoPipe } from '../../../../pipes/time-ago.pipe';
import { CommentsAndRepliesService } from '../../../../../core/services/comments-and-replies.service';
import { LucideEllipsis, LucideMessageCircle, LucidePencil, LucideTrash } from '@lucide/angular';
import { Meta } from '../../../../../core/models/meta-res.interface';
import { initDropdowns, Dropdown } from 'flowbite';
import { CommentFormComponent } from '../comment-form/comment-form.component';
import { CommentRepliesComponent } from '../comment-replies/comment-replies.component';

@Component({
  selector: 'app-post-comments',
  imports: [TimeAgoPipe, LucideMessageCircle, LucideEllipsis, LucidePencil, LucideTrash, CommentFormComponent, CommentRepliesComponent],
  templateUrl: './post-comments.component.html',
  styleUrl: './post-comments.component.css',
})
export class PostCommentsComponent implements OnInit {
  postId = input.required<string>();
  commentsCount = input.required<number>();

  // User login ID
  myId = signal<string>(JSON.parse(localStorage.getItem('routeUserInfo') as string)?._id ?? '');

  comments = signal<CommentIF[]>([]);

  meta = signal<Meta | null>(null);
  editingCommentId = signal<string | null>(null);
  openRepliesIds = signal<Record<string, boolean>>({});

  loading = signal(false);
  loadingMore = signal(false);

  likingCommentIds = signal<Record<string, boolean>>({});

  hasNextPage = computed(() => {
    const currentMeta = this.meta();
    return !!currentMeta && currentMeta.pagination.currentPage < currentMeta.pagination.numberOfPages;
  });

  _commentsAndRepliesService = inject(CommentsAndRepliesService);

  ngOnInit(): void {
    this.getPostComments();
  }

  getPostComments(): void {
    this.loading.set(true);
    this._commentsAndRepliesService.getAllPostComments(this.postId()).subscribe({
      next: (res) => {
        this.comments.set(res.data.comments);
        this.meta.set(res.meta);
        console.log(this.meta());

        setTimeout(() => {
          this.loading.set(false);
          setTimeout(() => {
            initDropdowns();
          });
        }, 500);
      },
      error: () => {
        setTimeout(() => {
          this.loading.set(false);
        }, 1000);
      },
    });
  }

  loadMoreComments(): void {
    const currentMeta = this.meta();
    if (!currentMeta || this.loadingMore()) return;

    const nextPage = currentMeta.pagination.currentPage + 1;
    if (nextPage > currentMeta.pagination.numberOfPages) return;

    this.loadingMore.set(true);
    this._commentsAndRepliesService.getAllPostComments(this.postId(), currentMeta.pagination.limit || 10, nextPage).subscribe({
      next: (res) => {
        this.comments.update((prev) => [...prev, ...(res.data?.comments ?? [])]);
        this.meta.set(res.meta ?? null);
        this.loadingMore.set(false);
        setTimeout(() => {
          initDropdowns();
        });
      },
      error: (err) => {
        console.error(err);
        this.loadingMore.set(false);
      },
    });
  }

  editComment(commentId: string) {
    this.toggleCommentDropdown(commentId);
    this.editingCommentId.set(commentId);
  }

  cancelEdit() {
    this.editingCommentId.set(null);
  }

  private toggleCommentDropdown(commentId: string): void {
    const triggerEl = document.querySelector(`[data-dropdown-toggle="commentOptions${commentId}"]`) as HTMLElement;

    const targetEl = document.getElementById(`commentOptions${commentId}`);

    if (!triggerEl || !targetEl) return;

    const dropdown = new Dropdown(targetEl, triggerEl);

    dropdown.hide();
  }

  toggleReplies(commentId: string): void {
    this.openRepliesIds.update((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  }

  isRepliesOpen(commentId: string): boolean {
    return !!this.openRepliesIds()[commentId];
  }

  incrementRepliesCount(commentId: string): void {
    this.comments.update((prev) => prev.map((comment) => (comment._id === commentId ? { ...comment, repliesCount: (comment.repliesCount ?? 0) + 1 } : comment)));
  }

  isCommentLiking(commentId: string): boolean {
    return !!this.likingCommentIds()[commentId];
  }

  isCommentLiked(comment: CommentIF): boolean {
    return comment.likes.includes(this.myId());
  }

  likeComment(commentId: string): void {
    if (this.isCommentLiking(commentId)) return;

    this.likingCommentIds.update((prev) => ({ ...prev, [commentId]: true }));

    this._commentsAndRepliesService.likeComment(this.postId(), commentId).subscribe({
      next: () => {
        const currentUserId = this.myId();
        this.comments.update((prev) =>
          prev.map((comment) => {
            if (comment._id !== commentId) return comment;
            const alreadyLiked = comment.likes.includes(currentUserId);
            return {
              ...comment,
              likes: alreadyLiked ? comment.likes.filter((id) => id !== currentUserId) : [...comment.likes, currentUserId],
            };
          }),
        );
        this.likingCommentIds.update((prev) => ({ ...prev, [commentId]: false }));
      },
      error: (err) => {
        console.error('Failed to toggle comment like:', err);
        this.likingCommentIds.update((prev) => ({ ...prev, [commentId]: false }));
      },
    });
  }
}
