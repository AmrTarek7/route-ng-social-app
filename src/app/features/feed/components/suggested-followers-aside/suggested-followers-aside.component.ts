import { Component } from '@angular/core';
import { LucideSearch, LucideUserPlus, LucideUsers } from '@lucide/angular';

@Component({
  selector: 'app-suggested-followers-aside',
  imports: [LucideSearch, LucideUsers, LucideUserPlus],
  templateUrl: './suggested-followers-aside.component.html',
  styleUrl: './suggested-followers-aside.component.css',
})
export class SuggestedFollowersAsideComponent {}
