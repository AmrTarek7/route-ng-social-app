import { Component, inject, OnInit, signal } from '@angular/core';
import { PostsService } from '../../core/services/posts.service';
import { PostModel } from '../../core/models/post.interface';
import { PostComponent } from '../../shared/ui/post/post.component';
import { User } from '../../core/models/user.interface';
import { SkeletonPostComponent } from '../../shared/ui/skeleton-post/skeleton-post.component';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { SuggestedFollowersAsideComponent } from './components/suggested-followers-aside/suggested-followers-aside.component';
import { MenuNavAsideComponent } from './components/menu-nav-aside/menu-nav-aside.component';
import { UserService } from '../../core/services/user.service';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-feed',
  imports: [PostComponent, SkeletonPostComponent, CreatePostComponent, SuggestedFollowersAsideComponent, MenuNavAsideComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
})
export class FeedComponent implements OnInit {
  _postService = inject(PostsService);
  _usersService = inject(UserService);

  postsList = signal<PostModel[]>([]);
  isLoading = signal<boolean>(true);
  readonly userData = signal<User>(JSON.parse(localStorage.getItem('routeUserInfo') as string));

  postMeta = signal<Meta>({} as Meta);

  ngOnInit(): void {
    this.getFeedPosts();
  }

  getFeedPosts(type: 'following' | 'me' | 'all' = 'following'): void {
    this.isLoading.set(true);
    this._postService.getFeedPosts(50, 1, type).subscribe({
      next: (res) => {
        // console.log('Posts API Response:', res);
        this.postsList.set(res.data?.posts);
        this.isLoading.set(false);
      },
      error: (err) => {
        // console.error('Error fetching posts:', err);
        this.isLoading.set(false);
      },
    });
  }

  getSavedPosts(): void {
    this.isLoading.set(true);
    this._usersService.getMyBookmarkPosts(1, 50).subscribe({
      next: (res) => {
        this.postsList.set(res.data?.bookmarks);
        this.postMeta.set(res.meta);
        this.isLoading.set(false);
      },
    });
  }

  getPosts(type: any) {
    if (type === 'saved') {
      this.getSavedPosts();
      return;
    }

    this.getFeedPosts(type);
  }
}
