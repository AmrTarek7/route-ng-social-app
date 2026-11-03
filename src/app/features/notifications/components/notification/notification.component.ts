import { Component, inject, input, linkedSignal, output } from '@angular/core';
import { LucideBell, LucideCheck, LucideDot, LucideHeart, LucideMessageCircle, LucideRepeat2, LucideUserPlus } from '@lucide/angular';
import { NotificationIF } from '../../../../core/models/notification.interface';
import { NgClass } from '@angular/common';
import { NotificationType } from '../../../../core/enums/notification-types.enum';
import { TimeAgoPipe } from '../../../../shared/pipes/time-ago.pipe';
import { NotificationsService } from '../../../../core/services/notifications.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-notification',
  imports: [LucideMessageCircle, LucideHeart, LucideBell, LucideRepeat2, LucideUserPlus, LucideCheck, LucideDot, TimeAgoPipe, NgClass, RouterLink],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
})
export class NotificationComponent {
  notification = input.required<NotificationIF>();

  router = inject(Router);

  localNotification = linkedSignal(() => this.notification());

  notificationType = NotificationType;

  updateUnreadNotificationList = output<NotificationIF>();

  _notificationsService = inject(NotificationsService);

  markNotificationAsRead(): void {
    this._notificationsService.markAsRead(this.notification()._id).subscribe({
      next: (res: any) => {
        // console.log(res);
        this.localNotification.update(() => res.data.notification);
        // this.updateUnreadNotification(this.notification());
        this.updateUnreadNotificationList.emit(this.notification());
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // updateUnreadNotification(notification: NotificationIF): void {
  //   this.updateUnreadNotificationList.emit(notification);
  // }
}
