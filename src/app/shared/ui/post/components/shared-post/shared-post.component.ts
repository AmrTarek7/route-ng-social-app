import { Component, input } from '@angular/core';
import { SharedPost } from '../../../../../core/models/post.interface';
import { LucideExternalLink } from '@lucide/angular';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-shared-post',
  imports: [LucideExternalLink, RouterLink],
  templateUrl: './shared-post.component.html',
  styleUrl: './shared-post.component.css',
})
export class SharedPostComponent {
  sharedPost = input.required<SharedPost | undefined>();
  readonly defaultAvatar = 'https://flowbite.com/docs/images/people/profile-picture-5.jpg';

  ngOnInit(): void {
    // console.log(this.sharedPost());
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target && target.src !== this.defaultAvatar) {
      target.src = this.defaultAvatar;
    }
  }
}
