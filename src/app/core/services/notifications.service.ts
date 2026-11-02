import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private baseURL = `${environment.baseUrl}/notifications`;
  // private authType = environment.authType;

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('userToken');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  private _http = inject(HttpClient);

  getAllNotifications(limit: number = 10, page: number = 1, unread?: boolean): Observable<any> {
    return this._http.get(`${this.baseURL}`, {
      headers: this.getAuthHeaders(),
      params: {
        page: page,
        limit: limit,
        ...(unread !== undefined && { unread }),
      },
    });
  }

  getUnreadNotificationsCount(): Observable<any> {
    return this._http.get(`${this.baseURL}/unread-count`, {
      headers: this.getAuthHeaders(),
    });
  }

  markAsRead(notificationId: string): Observable<any> {
    return this._http.patch(`${this.baseURL}/${notificationId}/read`, '', {
      headers: this.getAuthHeaders(),
    });
  }

  markAllAsRead(): Observable<any> {
    return this._http.patch(`${this.baseURL}/read-all`, '', {
      headers: this.getAuthHeaders(),
    });
  }
}
