import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { NotificationComponent } from './components/notification/notification.component';
import { NotificationsService } from '../../core/services/notifications.service';
import { NotificationIF } from '../../core/models/notification.interface';
import { Pagination } from '../../core/models/meta-res.interface';
import { LucideCheckCheck } from '@lucide/angular';
import { NgClass } from '@angular/common';
import { exhaustMap, take, timer } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-notifications',
  imports: [NotificationComponent, LucideCheckCheck, NgClass],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent {
  notifications = signal<NotificationIF[]>([]);

  unreadNotifications = signal<NotificationIF[]>([]);

  unreadCount = signal<number>(0);

  readNotificationBtnText = computed(() => (this.unreadCount() > 0 ? 'Mark all as read' : 'No unread notifications'));
  readNotificationBtnDisabled = computed(() => this.unreadCount() === 0);

  notificationTab = signal<'all' | 'unread'>('all');

  private readonly _notificationsService = inject(NotificationsService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    // take(20) => to stop timer after 20 iterations
    timer(0, 20000)
      .pipe(take(20), takeUntilDestroyed(this.destroyRef))
      .subscribe((time) => {
        this.getAllNotifications();
        this.getNotificationsCount();
      });
  }

  getAllNotifications(): void {
    this._notificationsService.getAllNotifications(50, 1).subscribe({
      next: (res) => {
        this.notifications.set(res.data.notifications);

        this.unreadNotifications.set(res.data.notifications);
        this.unreadNotifications.update((notifications) => notifications.filter((notification) => !notification.isRead));
      },
      error: (e) => console.log(e),
    });
  }

  getNotificationsCount(): void {
    this._notificationsService.getUnreadNotificationsCount().subscribe({
      next: (res) => {
        console.log(res);
        this.unreadCount.set(res.data.unreadCount);
      },
      error: (e) => console.log(e),
    });
  }

  markAllNotificationsAsRead(): void {
    if (this.unreadCount() === 0) return;

    this._notificationsService.markAllAsRead().subscribe({
      next: (res) => {
        console.log(res);
        this.unreadCount.set(0);
        this.notifications.update((notifications) => notifications.map((notification) => ({ ...notification, isRead: true })));
        this.unreadNotifications.set([]);
      },
      error: (e) => console.log(e),
    });
  }

  onNotificationTabChange(tab: 'all' | 'unread'): void {
    this.notificationTab.set(tab);
  }

  updateUnreadNotification(notification: NotificationIF): void {
    this.unreadNotifications.update((unreadNotifications) => unreadNotifications.filter((unreadNotification) => unreadNotification._id !== notification._id));
    this.notifications.update((notifications) => notifications.map((item) => (item._id === notification._id ? { ...item, isRead: true } : item)));
    this.unreadCount.update((unreadCount) => unreadCount - 1);
  }
}
