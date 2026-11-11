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
  myProfile = signal<MyProfile>({} as MyProfile);

  private baseURL = `${environment.baseUrl}/users`;
  private _http = inject(HttpClient);

  getFollowSuggestions(limit: number = 20, page: number = 1): Observable<any> {
    return this._http.get(`${this.baseURL}/suggestions`, {
      params: { limit, page },
    });
  }

  followUser(userId: string): Observable<any> {
    return this._http.put(`${this.baseURL}/${userId}/follow`, '');
  }

  userSearch(q: string | null, limit: number = 20, page: number = 1): Observable<any> {
    return this._http.get(`${this.baseURL}/search`, {
      params: { q: q ?? '', page, limit },
    });
  }

  private getLoggedUserProfile(): Observable<any> {
    return this._http.get(`${this.baseURL}/profile-data`);
  }

  uploadCover(formData: FormData): Observable<any> {
    return this._http.put(`${this.baseURL}/upload-cover`, formData);
  }

  deleteCover(): Observable<any> {
    return this._http.delete(`${this.baseURL}/cover`);
  }

  uploadPhoto(formData: FormData): Observable<any> {
    return this._http.put(`${this.baseURL}/upload-photo`, formData);
  }

  getMyBookmarkPosts(page: number = 1, limit: number = 20): Observable<any> {
    return this._http.get(`${this.baseURL}/bookmarks`, {
      params: { page, limit },
    });
  }

  getUserPosts(userId: string, page: number = 1, limit: number = 20): Observable<any> {
    return this._http.get(`${this.baseURL}/${userId}/posts`, {
      params: { page, limit },
    });
  }

  getAnyUserProfile(userId: string): Observable<any> {
    return this._http.get(`${this.baseURL}/${userId}/profile`);
  }

  getMyProfileInfo(): void {
    this.getLoggedUserProfile().subscribe({
      next: (res) => {
        this.myProfile.set(res.data.user);
      },
      error: (err) => {
        this.myProfile.set({} as MyProfile);
      },
    });
  }
}
