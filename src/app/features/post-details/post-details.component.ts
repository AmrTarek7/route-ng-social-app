import { Component, inject, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PostsService } from '../../core/services/posts.service';
import { PostComponent } from '../../shared/ui/post/post.component';
import { LucideArrowLeft } from '@lucide/angular';
import { SkeletonPostComponent } from '../../shared/ui/skeleton-post/skeleton-post.component';

@Component({
  selector: 'app-post-details',
  imports: [PostComponent, RouterLink, LucideArrowLeft, SkeletonPostComponent],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.css',
})
export class PostDetailsComponent implements OnInit {
  post = signal<any>(null);

  // The 'id' input is automatically bound to the route parameter
  // through withComponentInputBinding() configured in the router.
  id = input<string>('');

  private postsService = inject(PostsService);

  ngOnInit(): void {
    if (this.id() === '') return;

    this.getPostDetails(this.id());
  }

  getPostDetails(postId: string): void {
    this.postsService.getPostDetails(postId).subscribe({
      next: (response) => {
        this.post.set(response.data.post);
      },
    });
  }
}
