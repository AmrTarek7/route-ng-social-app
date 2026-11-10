import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private baseURL = `${environment.baseUrl}/posts`;
  // private authType = environment.authType;

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('userToken');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  private _http = inject(HttpClient);

  getAllPosts(): Observable<any> {
    return this._http.get(`${this.baseURL}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getFeedPosts(limit: number = 20, page: number = 1, onlyValue: 'following' | 'me' | 'all' = 'following'): Observable<any> {
    return this._http.get(`${this.baseURL}/feed?only=${onlyValue}&limit=${limit}&page=${page}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getPostDetails(postId: string): Observable<any> {
    return this._http.get(`${this.baseURL}/${postId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getPostLikes(postId: string, limit: number = 20, page: number = 1): Observable<any> {
    return this._http.get(`${this.baseURL}/${postId}/likes?limit=${limit}&page=${page}`, {
      headers: this.getAuthHeaders(),
    });
  }

  createPost(formData: any): Observable<any> {
    return this._http.post(`${this.baseURL}`, formData, {
      headers: this.getAuthHeaders(),
    });
  }

  updatePost(postId: string, formData: any): Observable<any> {
    return this._http.put(`${this.baseURL}/${postId}`, formData, {
      headers: this.getAuthHeaders(),
    });
  }

  deletePost(postId: string): Observable<any> {
    return this._http.delete(`${this.baseURL}/${postId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  likePost(postId: string): Observable<any> {
    return this._http.put(`${this.baseURL}/${postId}/like`, '', {
      headers: this.getAuthHeaders(),
    });
  }

  bookmarkPost(postId: string): Observable<any> {
    return this._http.put(`${this.baseURL}/${postId}/bookmark`, '', {
      headers: this.getAuthHeaders(),
    });
  }

  sharePost(postId: string, body: { body: string } | ''): Observable<any> {
    return this._http.post(`${this.baseURL}/${postId}/share`, body, {
      headers: this.getAuthHeaders(),
    });
  }
}
