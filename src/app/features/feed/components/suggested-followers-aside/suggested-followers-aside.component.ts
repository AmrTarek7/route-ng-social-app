import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideSearch, LucideUsers } from '@lucide/angular';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'; // 1. استيراد الأداة الحديثة
import { FollowerIF } from '../../../../core/models/follower.interface';
import { Meta } from '../../../../core/models/meta-res.interface';
import { UserService } from '../../../../core/services/user.service';
import { SkeletonFollowerCardComponent } from '../../../../shared/ui/skeleton-follower-card/skeleton-follower-card.component';
import { SuggestedFllowerCardComponent } from './components/suggested-fllower-card/suggested-fllower-card.component';

@Component({
  selector: 'app-suggested-followers-aside',
  imports: [LucideSearch, LucideUsers, SuggestedFllowerCardComponent, SkeletonFollowerCardComponent, RouterLink],
  templateUrl: './suggested-followers-aside.component.html',
  styleUrl: './suggested-followers-aside.component.css',
})
export class SuggestedFollowersAsideComponent implements OnInit {
  readonly _userService = inject(UserService);

  readonly suggestedFollowers = computed<FollowerIF[]>(() => this._userService.followersSuggestion().slice(0, 5));

  private searchTerms = new Subject<string>();
  readonly isSearching = computed<boolean>(() => Boolean(this.searchValue()));
  readonly suggestedFollowersSearch = computed<FollowerIF[]>(() => (this.searchUsers() ?? []).slice(0, 5));

  isLoading = signal<boolean>(false);
  searchMeta = signal<Meta>({} as Meta);
  searchUsers = signal<FollowerIF[] | null>(null);
  searchValue = signal<string | null>(null);
  searchLoading = signal<boolean>(false);

  constructor() {
    this.setupSearchSubscription();
  }

  ngOnInit(): void {
    this.getFollowSuggestions();
  }

  getFollowSuggestions(): void {
    this.isLoading.set(true);

    this._userService.getFollowSuggestions().subscribe({
      next: (res) => {
        this._userService.followersSuggestion.set(res.data?.suggestions ?? []);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  setupSearchSubscription(): void {
    this.searchTerms
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        switchMap((value) => {
          if (!value.trim()) {
            this.searchMeta.set({} as Meta);
            this.searchUsers.set(null);
            this.searchLoading.set(false);
            return [];
          }

          this.searchLoading.set(true);
          return this._userService.userSearch(value);
        }),
        takeUntilDestroyed(),
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
          console.log(err);
          this.searchUsers.set([]);
          this.searchLoading.set(false);
        },
      });
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
      return;
    }

    this.searchUsers.set([]);
    this.searchLoading.set(true);

    // Subject إرسال القيمة للـ
    this.searchTerms.next(value);
  }
}
