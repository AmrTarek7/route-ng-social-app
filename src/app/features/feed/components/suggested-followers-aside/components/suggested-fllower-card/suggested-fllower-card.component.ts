import { Component, computed, inject, input, linkedSignal, output, signal } from '@angular/core';
import { LucideUserCheck, LucideUserPlus } from '@lucide/angular';
import { FollowerIF } from '../../../../../../core/models/follower.interface';
import { UserService } from '../../../../../../core/services/user.service';
import { finalize } from 'rxjs';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-suggested-fllower-card',
  imports: [LucideUserPlus, NgClass, LucideUserCheck],
  templateUrl: './suggested-fllower-card.component.html',
  styleUrl: './suggested-fllower-card.component.css',
})
export class SuggestedFllowerCardComponent {
  private _userService = inject(UserService);

  refreshFollowersSuggestionsList = output<void>();

  follower = input.required<FollowerIF>();

  loading = signal<boolean>(false);

  myFollowingUsers = signal(new Set<string>());

  ngOnInit(): void {
    this.myFollowingUsers.set(new Set(this._userService.myProfile()?.following));
  }

  followUser(): void {
    this.loading.set(true);
    this._userService
      .followUser(this.follower()._id)
      .pipe(
        finalize(() => {
          this.refreshFollowersSuggestionsList.emit();
          this.loading.set(false);
        }),
      )
      .subscribe({
        next: (response) => {
          this.addOrDeleteFollowingId(response.data.following);
        },
        error: (err) => console.log(err),
      });
  }

  addOrDeleteFollowingId(following: boolean): void {
    if (following) {
      this._userService.myProfile.update((prev) => ({
        ...prev,
        following: [...prev?.following, this.follower()._id],
      }));

      this.myFollowingUsers.update((prevSet) => {
        const newSet = new Set(prevSet);
        newSet.add(this.follower()._id);
        return newSet;
      });
      return;
    }

    // delete following id
    this._userService.myProfile.update((prev) => ({
      ...prev,
      following: prev.following.filter((id: string) => id !== this.follower()._id),
    }));
    this.myFollowingUsers.update((prevSet) => {
      const newSet = new Set(prevSet);
      newSet.delete(this.follower()._id);
      return newSet;
    });
  }
}
