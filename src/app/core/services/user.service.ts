import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FollowerIF } from '../models/follower.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  followersSuggestion = signal<FollowerIF[]>([]);

  private baseURL = `${environment.baseUrl}/users`;
  // private authType = environment.authType;

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('userToken');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  private _http = inject(HttpClient);

  getFollowSuggestions(limit: number = 20): Observable<any> {
    return this._http.get(`${this.baseURL}/suggestions`, {
      headers: this.getAuthHeaders(),
      params: { limit },
    });
  }

  followUser(userId: string): Observable<any> {
    return this._http.put(`${this.baseURL}/${userId}/follow`, '', {
      headers: this.getAuthHeaders(),
    });
  }
}
