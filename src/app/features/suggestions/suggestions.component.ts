import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideArrowLeft, LucideSearch, LucideUsers } from '@lucide/angular';
import { UserService } from '../../core/services/user.service';
import { FollowerIF } from '../../core/models/follower.interface';
import { SuggestedFllowerCardComponent } from '../feed/components/suggested-followers-aside/components/suggested-fllower-card/suggested-fllower-card.component';
import { SkeletonFollowerCardComponent } from '../../shared/ui/skeleton-follower-card/skeleton-follower-card.component';
import { Meta } from './../../core/models/meta-res.interface';
import { concatMap, debounceTime, distinctUntilChanged, range, Subject, Subscription, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-suggestions',
  imports: [RouterLink, LucideArrowLeft, LucideUsers, LucideSearch, SuggestedFllowerCardComponent, SkeletonFollowerCardComponent],
  templateUrl: './suggestions.component.html',
  styleUrl: './suggestions.component.css',
})
export class SuggestionsComponent implements OnInit {
  readonly _userService = inject(UserService);

  meta = signal<Meta>({} as Meta);
  page = signal(1);
  isLoadingMore = signal<boolean>(false);
  skeltonCount = signal([1, 2, 3, 4, 5, 6]);

  private searchTerms = new Subject<string>();

  searchMeta = signal<Meta>({} as Meta);
  searchUsers = signal<FollowerIF[] | null>(null);
  searchValue = signal<string | null>(null);
  searchLoading = signal(false);

  readonly isSearching = computed<boolean>(() => Boolean(this.searchValue()));

  hasNextPage = computed<boolean>(() => {
    const currentMeta = this.meta();
    return !!currentMeta && currentMeta?.pagination?.currentPage < currentMeta?.pagination?.numberOfPages;
  });

  hasNextSearchPage = computed<boolean>(() => {
    const currentMeta = this.searchMeta();
    return !!currentMeta && currentMeta?.pagination?.currentPage < currentMeta?.pagination?.numberOfPages;
  });

  constructor() {
    this.setupSearchSubscription();
  }

  ngOnInit(): void {
    this.getFollowSuggestions();
  }

  getFollowSuggestions(): void {
    const limit = 20;
    const totalPages = this.page();

    this.isLoadingMore.set(true);

    range(1, totalPages)
      .pipe(
        concatMap((pageReq) => {
          return this._userService.getFollowSuggestions(limit, pageReq);
        }),
      )
      .subscribe({
        next: (res) => {
          if (res?.meta?.pagination?.currentPage === 1) {
            this._userService.followersSuggestion.set(res.data?.suggestions);
          } else {
            this.updateFollowersSuggestions(res.data?.suggestions);
          }

          this.meta.set(res.meta);
        },

        error: (err) => {
          console.error(err);
          this.isLoadingMore.set(false);
        },
        complete: () => {
          console.log('ALL REQUESTS COMPLETED');
          this.isLoadingMore.set(false);
        },
      });
  }

  loadMoreSuggestions(): void {
    if (!this.meta() || this.isLoadingMore()) return;

    const nextPage = this.meta()?.pagination?.currentPage + 1;
    if (nextPage > this.meta()?.pagination?.numberOfPages) return;

    this.isLoadingMore.set(true);
    this._userService.getFollowSuggestions(20, nextPage).subscribe({
      next: (res) => {
        this.updateFollowersSuggestions(res.data?.suggestions);
        this.meta.set(res.meta);
        this.isLoadingMore.set(false);

        this.page.set(res?.meta?.pagination?.currentPage);
      },
      error: (err) => {
        console.error(err);
        this.isLoadingMore.set(false);
      },
    });
  }

  updateFollowersSuggestions(newSuggestions: FollowerIF[]): void {
    this._userService.followersSuggestion.update((prev) => [...prev, ...newSuggestions]);
  }

  onSearch(input: HTMLInputElement): void {
    const value = input.value.trim();
    this.searchValue.set(value ? value : null);

    if (!value) {
      this.searchMeta.set({} as Meta);
      this.searchUsers.set(null);
      this.searchLoading.set(false);

      if (this._userService.followersSuggestion().length === 0) {
        this.getFollowSuggestions();
      }
    }

    this.searchUsers.set([]);
    this.searchLoading.set(true);

    // إرسال القيمة الجديدة للـ Subject ليتم معالجتها بالـ debounceTime
    this.searchTerms.next(value);
  }

  loadMoreSearch() {
    if (!this.searchMeta() || this.searchLoading()) return;

    const nextPage = this.searchMeta()?.pagination?.currentPage + 1;
    if (nextPage > this.searchMeta()?.pagination?.numberOfPages) return;

    this.searchLoading.set(true);
    this._userService.userSearch(this.searchValue(), 20, nextPage).subscribe({
      next: (res) => {
        this.searchMeta.set(res.meta);
        this.searchLoading.set(false);
        this.searchUsers.update((prev) => [...(prev ?? []), ...res.data?.users]);
      },
      error: (err) => {
        console.error(err);
        this.searchLoading.set(false);
      },
    });
  }

  setupSearchSubscription(): void {
    this.searchTerms
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        switchMap((value) => {
          // لو الحقل فاضي، بنظف نتائج البحث ومش بنبعت طلب للسيرفر
          if (!value.trim()) {
            this.searchMeta.set({} as Meta);
            this.searchUsers.set(null);
            this.searchLoading.set(false);
            return [];
          }

          this.searchLoading.set(true);
          return this._userService.userSearch(value);
        }),
        takeUntilDestroyed(), // <-- أضفها هنا وهي هتتكفل بقفل الاشتراك تلقائياً لما الكومبوننت يتدمر!
      )
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.searchMeta.set(res.meta);
            this.searchUsers.set(res.data?.users);
            this.searchLoading.set(false);
          }
        },
        error: (err) => {
          console.error(err);
          this.searchUsers.set([]);
          this.searchLoading.set(false);
        },
      });
  }
}
