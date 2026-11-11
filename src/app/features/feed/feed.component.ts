import { Component, computed, effect, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { PostsService } from '../../core/services/posts.service';
import { PostModel } from '../../core/models/post.interface';
import { PostComponent } from '../../shared/ui/post/post.component';
import { User } from '../../core/models/user.interface';
import { SkeletonPostComponent } from '../../shared/ui/skeleton-post/skeleton-post.component';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { SuggestedFollowersAsideComponent } from './components/suggested-followers-aside/suggested-followers-aside.component';
import { MenuNavAsideComponent } from './components/menu-nav-aside/menu-nav-aside.component';
import { UserService } from '../../core/services/user.service';
import { Meta } from '../../core/models/meta-res.interface';
import { LucideLoaderCircle } from '@lucide/angular';

@Component({
  selector: 'app-feed',
  imports: [PostComponent, SkeletonPostComponent, CreatePostComponent, SuggestedFollowersAsideComponent, MenuNavAsideComponent, LucideLoaderCircle],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
})
export class FeedComponent implements OnInit {
  _postService = inject(PostsService);
  _usersService = inject(UserService);

  postsList = signal<PostModel[]>([]);
  isLoading = signal<boolean>(true);
  isLoadingMore = signal<boolean>(false);
  readonly userData = signal<User>(JSON.parse(localStorage.getItem('routeUserInfo') as string));

  postMeta = signal<Meta>({} as Meta);
  currentType = signal<'following' | 'me' | 'all' | 'saved'>('following');

  hasNextPage = computed<boolean>(() => {
    const currentMeta = this.postMeta();
    return !!currentMeta?.pagination && currentMeta.pagination.currentPage < currentMeta.pagination.numberOfPages;
  });

  loadMoreTrigger = viewChild<ElementRef<HTMLElement>>('loadMoreTrigger');

  constructor() {
    effect((onCleanup) => {
      const triggerEl = this.loadMoreTrigger()?.nativeElement;
      const canLoadMore = this.hasNextPage() && !this.isLoading() && !this.isLoadingMore();
      if (!triggerEl || !canLoadMore) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            this.loadMorePosts();
          }
        },
        { threshold: 0.1 },
      );

      observer.observe(triggerEl);

      onCleanup(() => {
        observer.disconnect();
      });
    });
  }

  ngOnInit(): void {
    this.getFeedPosts();
  }

  getFeedPosts(type: 'following' | 'me' | 'all' = 'following', page: number = 1): void {
    this.currentType.set(type);
    if (page === 1) {
      this.isLoading.set(true);
      this.postsList.set([]);
    } else {
      this.isLoadingMore.set(true);
    }

    this._postService.getFeedPosts(20, page, type).subscribe({
      next: (res) => {
        const newPosts = res.data?.posts ?? [];
        if (page === 1) {
          this.postsList.set(newPosts);
        } else {
          this.postsList.update((prev) => [...prev, ...newPosts]);
        }
        this.postMeta.set(res.meta);
        this.isLoading.set(false);
        this.isLoadingMore.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.isLoadingMore.set(false);
      },
    });
  }

  getSavedPosts(page: number = 1): void {
    this.currentType.set('saved');
    if (page === 1) {
      this.isLoading.set(true);
      this.postsList.set([]);
    } else {
      this.isLoadingMore.set(true);
    }

    this._usersService.getMyBookmarkPosts(page, 20).subscribe({
      next: (res) => {
        const newBookmarks = res.data?.bookmarks;
        if (page === 1) {
          this.postsList.set(newBookmarks);
        } else {
          this.postsList.update((prev) => [...prev, ...newBookmarks]);
        }
        this.postMeta.set(res.meta);
        this.isLoading.set(false);
        this.isLoadingMore.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.isLoadingMore.set(false);
      },
    });
  }

  loadMorePosts(): void {
    if (this.isLoading() || this.isLoadingMore() || !this.hasNextPage()) return;

    const nextPage = this.postMeta().pagination.currentPage + 1;
    if (this.currentType() === 'saved') {
      this.getSavedPosts(nextPage);
    } else {
      this.getFeedPosts(this.currentType() as 'following' | 'me' | 'all', nextPage);
    }
  }

  getPosts(type: any) {
    if (type === 'saved') {
      this.getSavedPosts();
      return;
    }

    this.getFeedPosts(type);
  }
}
