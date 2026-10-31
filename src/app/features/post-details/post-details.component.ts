import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PostsService } from '../../core/services/posts.service';
import { PostComponent } from '../../shared/ui/post/post.component';
import { PostModel } from '../../core/models/post.interface';
import { LucideArrowLeft } from '@lucide/angular';
import { SkeletonPostComponent } from '../../shared/ui/skeleton-post/skeleton-post.component';

@Component({
  selector: 'app-post-details',
  imports: [PostComponent, RouterLink, LucideArrowLeft, SkeletonPostComponent],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.css',
})
export class PostDetailsComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private postsService = inject(PostsService);

  post = signal<any>(null);

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (id) {
        this.getPostDetails(id);
      }
    });
  }

  getPostDetails(postId: string): void {
    this.postsService.getPostDetails(postId).subscribe({
      next: (response) => {
        this.post.set(response.data.post);
      },
    });
  }
}
