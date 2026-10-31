import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { LucideUsers, LucideX } from '@lucide/angular';
import { Likes } from '../../../../../core/models/likes.interface';
import { PostsService } from '../../../../../core/services/posts.service';
import { RouterLink } from '@angular/router';
import { Pagination } from '../../../../../core/models/meta-res.interface';

@Component({
  selector: 'app-post-likes',
  imports: [LucideX, LucideUsers, RouterLink],
  templateUrl: './post-likes.component.html',
  styleUrl: './post-likes.component.css',
})
export class PostLikesComponent implements OnInit {
  closeModal = output<void>();

  postId = input.required<string>();

  likesList = signal<Likes[]>([]);

  pagination = signal<Pagination>({} as Pagination);

  _postsService = inject(PostsService);

  ngOnInit(): void {
    this.getPostLikes();
  }

  closeLikeModal() {
    this.closeModal.emit();
  }

  getPostLikes(): void {
    this._postsService.getPostLikes(this.postId()).subscribe({
      next: (res: any) => {
        this.likesList.set(res.data.likes);
        this.pagination.set(res.meta.pagination);
      },
      error: (err: any) => console.log(err),
    });
  }

  getNextPage() {
    if (this.pagination().currentPage < this.pagination()?.numberOfPages) {
      this._postsService.getPostLikes(this.postId(), 20, this.pagination().currentPage + 1).subscribe({
        next: (res: any) => {
          this.likesList.update((prev) => [...prev, ...res.data.likes]);
          console.log(res);
          this.pagination.set(res.meta.pagination);
        },
        error: (err: any) => console.log(err),
      });
    }
  }
}
