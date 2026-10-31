import { Component, input } from '@angular/core';

@Component({
  selector: 'app-skeleton-post',
  imports: [],
  templateUrl: './skeleton-post.component.html',
  styleUrl: './skeleton-post.component.css',
})
export class SkeletonPostComponent {
  countOfPostsSkeleton = input<number[]>([1, 2, 3, 4]);
}
