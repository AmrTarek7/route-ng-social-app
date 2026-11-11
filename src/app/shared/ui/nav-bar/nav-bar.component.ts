import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { User } from '../../../core/models/user.interface';
import { AuthService } from '../../../core/auth/service/auth.service';
import { NotificationsService } from '../../../core/services/notifications.service';
import { take, timer } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent implements OnInit {
  user = signal<User | null>(null);

  _authService = inject(AuthService);

  _notificationsService = inject(NotificationsService);

  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const userData = localStorage.getItem('routeUserInfo');
    if (userData) {
      this.user.set(JSON.parse(userData));
    }

    timer(0, 20000)
      .pipe(take(20), takeUntilDestroyed(this.destroyRef))
      .subscribe((time) => {
        this.getNotificationsCount();
      });
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

  getNotificationsCount(): void {
    this._notificationsService.getUnreadNotificationsCount().subscribe({
      next: (res) => {
        console.log(res);
        this._notificationsService.notifactionCounts.set(res.data.unreadCount);
      },
      error: (e) => console.log(e),
    });
  }
}
