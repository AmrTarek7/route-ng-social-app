import { Component, computed, inject, input, signal } from '@angular/core';
import { LucideUserPlus } from '@lucide/angular';
import { FollowerIF } from '../../../../../../core/models/follower.interface';
import { UserService } from '../../../../../../core/services/user.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-suggested-fllower-card',
  imports: [LucideUserPlus],
  templateUrl: './suggested-fllower-card.component.html',
  styleUrl: './suggested-fllower-card.component.css',
})
export class SuggestedFllowerCardComponent {
  private _userService = inject(UserService);

  follower = input.required<FollowerIF>();

  loading = signal<boolean>(false);

  ngOnInit(): void {}

  followUser(): void {
    if (this._userService.followersSuggestion().length === 6) return;

    this.loading.set(true);
    this._userService
      .followUser(this.follower()._id)
      .pipe(
        finalize(() => {
          this._userService.followersSuggestion.update((prev) => prev.filter((item) => item._id !== this.follower()._id));
          console.log(this._userService.followersSuggestion());
          this.loading.set(false);
        }),
      )
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => {
          console.log(this._userService.followersSuggestion());
        },
      });
  }
}
