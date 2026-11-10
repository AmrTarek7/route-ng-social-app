import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FollowerIF } from '../models/follower.interface';
import { MyProfile } from '../models/my-profile.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  followersSuggestion = signal<FollowerIF[]>([]);

  private baseURL = `${environment.baseUrl}/users`;
  // private authType = environment.authType;

  myProfile = signal<MyProfile>({} as MyProfile);

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('userToken');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  private _http = inject(HttpClient);

  getFollowSuggestions(limit: number = 20, page: number = 1): Observable<any> {
    return this._http.get(`${this.baseURL}/suggestions`, {
      headers: this.getAuthHeaders(),
      params: { limit, page },
    });
  }

  followUser(userId: string): Observable<any> {
    return this._http.put(`${this.baseURL}/${userId}/follow`, '', {
      headers: this.getAuthHeaders(),
    });
  }

  userSearch(q: string | null, limit: number = 20, page: number = 1): Observable<any> {
    return this._http.get(`${this.baseURL}/search`, {
      params: { q: q ?? '', page, limit },
      headers: this.getAuthHeaders(),
    });
  }

  private getLoggedUserProfile(): Observable<any> {
    return this._http.get(`${this.baseURL}/profile-data`, {
      headers: this.getAuthHeaders(),
    });
  }

  uploadCover(formData: FormData): Observable<any> {
    return this._http.put(`${this.baseURL}/upload-cover`, formData, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteCover(): Observable<any> {
    return this._http.delete(`${this.baseURL}/cover`, {
      headers: this.getAuthHeaders(),
    });
  }

  uploadPhoto(formData: FormData): Observable<any> {
    return this._http.put(`${this.baseURL}/upload-photo`, formData, {
      headers: this.getAuthHeaders(),
    });
  }

  getMyBookmarkPosts(page: number = 1, limit: number = 20): Observable<any> {
    return this._http.get(`${this.baseURL}/bookmarks`, {
      headers: this.getAuthHeaders(),
      params: {
        page,
        limit,
      },
    });
  }

  getMyProfile(): void {
    this.getLoggedUserProfile().subscribe({
      next: (res) => {
        this.myProfile.set(res.data.user);
      },
      error: (err) => {
        this.myProfile.set({} as MyProfile);
      },
    });
  }

  getProfileAnyUser(userId: string): Observable<any> {
    return this._http.get(`${this.baseURL}/${{ userId }}/profile`, {
      headers: this.getAuthHeaders(),
    });
  }
}
