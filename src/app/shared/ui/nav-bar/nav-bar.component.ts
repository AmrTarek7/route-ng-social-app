import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { User } from '../../../core/models/user.interface';
import { AuthService } from '../../../core/auth/service/auth.service';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent implements OnInit {
  user = signal<User | null>(null);

  _authService = inject(AuthService);

  ngOnInit(): void {
    const userData = localStorage.getItem('routeUserInfo');
    if (userData) {
      this.user.set(JSON.parse(userData));
    }
  }
  // Hide & Show User Menu
  toggleUserMenu(element: HTMLElement | HTMLInputElement): void {
    //
    if (element.classList.contains('hidden')) {
      element.classList.remove('hidden');
    } else {
      element.classList.add('hidden');
    }
  }

  logoutUser(element: HTMLElement | HTMLInputElement): void {
    this.toggleUserMenu(element);
    this._authService.logout();
  }
}
