import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private baseURL = `${environment.baseUrl}/notifications`;

  private _http = inject(HttpClient);

  notifactionCounts = signal(0);

  getAllNotifications(limit: number = 10, page: number = 1, unread?: boolean): Observable<any> {
    return this._http.get(`${this.baseURL}`, {
      params: {
        page: page,
        limit: limit,
        ...(unread !== undefined && { unread }),
      },
    });
  }

  getUnreadNotificationsCount(): Observable<any> {
    return this._http.get(`${this.baseURL}/unread-count`);
  }

  markAsRead(notificationId: string): Observable<any> {
    return this._http.patch(`${this.baseURL}/${notificationId}/read`, '');
  }

  markAllAsRead(): Observable<any> {
    return this._http.patch(`${this.baseURL}/read-all`, '');
  }
}
