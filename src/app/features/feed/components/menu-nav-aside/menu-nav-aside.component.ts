import { NgClass } from '@angular/common';
import { Component, output, signal } from '@angular/core';
import { LucideBookmark, LucideEarth, LucideNewspaper, LucideSparkle } from '@lucide/angular';

@Component({
  selector: 'app-menu-nav-aside',
  imports: [LucideNewspaper, LucideSparkle, LucideEarth, LucideBookmark, NgClass],
  templateUrl: './menu-nav-aside.component.html',
  styleUrl: './menu-nav-aside.component.css',
})
export class MenuNavAsideComponent {
  type = signal<'following' | 'all' | 'me' | 'saved'>('following');
  getPost = output<string>();

  getAllPosts(type: any) {
    this.getPost.emit(type);
    this.type.set(type);
  }
}
