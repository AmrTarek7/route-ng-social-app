import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { Location, NgStyle } from '@angular/common';
import { UserService } from '../../core/services/user.service';
import { MyProfile } from '../../core/models/my-profile.interface';
import { PostModel } from '../../core/models/post.interface';
import { Meta } from '@angular/platform-browser';
import { PostComponent } from '../../shared/ui/post/post.component';
import { SkeletonPostComponent } from '../../shared/ui/skeleton-post/skeleton-post.component';
import { LucideCheck, LucideUserPlus } from '@lucide/angular';

@Component({
  selector: 'app-global-profile',
  imports: [PostComponent, SkeletonPostComponent, LucideUserPlus, LucideCheck, NgStyle],
  templateUrl: './global-profile.component.html',
  styleUrl: './global-profile.component.css',
})
export class GlobalProfileComponent implements OnInit {
  id = input<string>();
  profileInfo = signal<MyProfile>({} as MyProfile);
  userPostsList = signal<PostModel[]>([]);
  isFollowing = signal(false);

  loadingFollowResponse = signal(false);

  postMetaInfo = signal<Meta>({} as Meta);

  _userService = inject(UserService);
  private readonly _location = inject(Location);

  loading = signal(false);

  ngOnInit(): void {
    this.getProfileInfo(this.id()!);
    this.getUserPosts(this.id()!);
  }

  coverStyle = computed(() => {
    const cover = this.profileInfo()?.cover;

    return cover
      ? {
          'background-image': `linear-gradient(rgba(15, 23, 42, 0.22), rgba(15, 23, 42, 0.4)), url('${cover}')`,
          'background-size': 'cover',
          'background-position': ' center center',
        }
      : {};
  });

  getProfileInfo(id: string): void {
    this.loading.set(true);
    this._userService.getAnyUserProfile(id).subscribe({
      next: (res) => {
        this.profileInfo.set(res.data.user);
        this.isFollowing.set(res.data.isFollowing);
        this.loading.set(false);
      },
      error: (err) => console.log(err),
    });
  }

  getUserPosts(id: string): void {
    this._userService.getUserPosts(id, 1, 30).subscribe({
      next: (res) => {
        this.userPostsList.set(res.data.posts);
        this.postMetaInfo.set(res.meta);
        console.log('userPostsList ::', this.userPostsList());
        console.log('this.postMetaInfo ::', this.postMetaInfo());

        // console.log(res);
      },
    });
  }

  followAndUnfollow(): void {
    this.loadingFollowResponse.set(true);
    this._userService.followUser(this.id()!).subscribe({
      next: () => {
        this.loadingFollowResponse.set(false);
        this.isFollowing.update((val) => !val);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  goBack(): void {
    this._location.back();
  }
}
