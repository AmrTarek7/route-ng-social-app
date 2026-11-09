import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-skeleton-follower-card',
  imports: [],
  templateUrl: './skeleton-follower-card.component.html',
  styleUrl: './skeleton-follower-card.component.css',
})
export class SkeletonFollowerCardComponent {
  count = input<number>(5);
  layout = input<'list' | 'grid'>('list');
  readonly items = computed(() => Array.from({ length: this.count() }, (_, index) => index));
}
