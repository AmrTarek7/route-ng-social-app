import { Component } from '@angular/core';
import { LucideBookmark, LucideEarth, LucideNewspaper, LucideSparkle } from '@lucide/angular';

@Component({
  selector: 'app-menu-nav-aside',
  imports: [LucideNewspaper, LucideSparkle, LucideEarth, LucideBookmark],
  templateUrl: './menu-nav-aside.component.html',
  styleUrl: './menu-nav-aside.component.css',
})
export class MenuNavAsideComponent {}
