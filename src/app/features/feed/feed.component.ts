import { Component, inject, OnInit, signal } from '@angular/core';
import { PostsService } from '../../core/services/posts.service';
import { PostModel } from '../../core/models/post.interface';
import { PostComponent } from '../../shared/ui/post/post.component';
import { User } from '../../core/models/user.interface';
import { SkeletonPostComponent } from '../../shared/ui/skeleton-post/skeleton-post.component';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { SuggestedFollowersAsideComponent } from './components/suggested-followers-aside/suggested-followers-aside.component';
import { MenuNavAsideComponent } from './components/menu-nav-aside/menu-nav-aside.component';

@Component({
  selector: 'app-feed',
  imports: [PostComponent, SkeletonPostComponent, CreatePostComponent, SuggestedFollowersAsideComponent, MenuNavAsideComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
})
export class FeedComponent implements OnInit {
  _postService = inject(PostsService);

  postsList = signal<PostModel[]>([]);
  isLoading = signal<boolean>(true);
  readonly userData = signal<User>(JSON.parse(localStorage.getItem('routeUserInfo') as string));

  ngOnInit(): void {
    this.getFeedPosts();
  }

  getFeedPosts(): void {
    this.isLoading.set(true);
    this._postService.getFeedPosts().subscribe({
      next: (res) => {
        console.log('Posts API Response:', res);
        this.postsList.set(res.data?.posts);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching posts:', err);
        this.isLoading.set(false);
      },
    });
  }
}
