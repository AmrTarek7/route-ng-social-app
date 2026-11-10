import { Component, input } from '@angular/core';
import { PostModel } from '../../../../core/models/post.interface';
import { LucideClock3, LucideMessageCircle, LucideRepeat2, LucideThumbsUp } from '@lucide/angular';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-profile-post-view',
  imports: [LucideThumbsUp, LucideRepeat2, RouterLink, LucideMessageCircle, LucideClock3, DatePipe, RouterLink],
  templateUrl: './my-profile-post-view.component.html',
  styleUrl: './my-profile-post-view.component.css',
})
export class MyProfilePostViewComponent {
  post = input.required<PostModel>();
}
