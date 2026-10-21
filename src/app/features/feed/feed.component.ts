import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PostsService } from '../../core/services/posts.service';
import { PostModel } from '../../core/models/post.interface';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-feed',
  imports: [DatePipe],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
})
export class FeedComponent implements OnInit {
  _postService = inject(PostsService);

  postsList = signal<PostModel[]>([]);
  isLoading = signal<boolean>(true);

  readonly defaultAvatar = 'https://flowbite.com/docs/images/people/profile-picture-5.jpg';

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts(): void {
    this.isLoading.set(true);
    this._postService.getAllPosts().subscribe({
      next: (res) => {
        console.log('Posts API Response:', res);
        const posts = res.data?.posts || res.posts || [];
        this.postsList.set(posts);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching posts:', err);
        this.isLoading.set(false);
      },
    });
  }

  onImageError(event: Event, fallback: string = this.defaultAvatar): void {
    const target = event.target as HTMLImageElement;
    if (target && target.src !== fallback) {
      target.src = fallback;
    }
  }
}
