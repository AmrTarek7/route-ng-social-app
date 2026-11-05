import { Component, inject, signal, OnInit, computed, effect } from '@angular/core';
import { LucideSearch, LucideUsers } from '@lucide/angular';
import { UserService } from '../../../../core/services/user.service';
import { FollowerIF } from '../../../../core/models/follower.interface';
import { SuggestedFllowerCardComponent } from './components/suggested-fllower-card/suggested-fllower-card.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-suggested-followers-aside',
  imports: [LucideSearch, LucideUsers, SuggestedFllowerCardComponent],
  templateUrl: './suggested-followers-aside.component.html',
  styleUrl: './suggested-followers-aside.component.css',
})
export class SuggestedFollowersAsideComponent implements OnInit {
  readonly _userService = inject(UserService);

  readonly suggestedFollowers = computed<FollowerIF[]>(() => this._userService.followersSuggestion().slice(0, 5));

  loading = false;

  // refreshFollowerSuggestion = effect(() => {
  //   if (this._userService.followersSuggestion().length <= 6 && !this.loading) {
  //     console.log(this._userService.followersSuggestion().length <= 6 && !this.loading);
  //     this.getFollowSuggestions();
  //   }
  // });

  ngOnInit(): void {
    this.getFollowSuggestions();
  }

  getFollowSuggestions(): void {
    this.loading = true;

    this._userService
      .getFollowSuggestions(50)
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe({
        next: (res) => {
          this._userService.followersSuggestion.set(res.data.suggestions);
        },
      });
  }
}
