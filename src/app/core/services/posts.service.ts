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

  private _http = inject(HttpClient);

  getAllPosts(): Observable<any> {
    return this._http.get(`${this.baseURL}`);
  }

  getFeedPosts(limit: number = 20, page: number = 1, onlyValue: 'following' | 'me' | 'all' = 'following'): Observable<any> {
    return this._http.get(`${this.baseURL}/feed?only=${onlyValue}&limit=${limit}&page=${page}`);
  }

  getPostDetails(postId: string): Observable<any> {
    return this._http.get(`${this.baseURL}/${postId}`);
  }

  getPostLikes(postId: string, limit: number = 20, page: number = 1): Observable<any> {
    return this._http.get(`${this.baseURL}/${postId}/likes?limit=${limit}&page=${page}`);
  }

  createPost(formData: any): Observable<any> {
    return this._http.post(`${this.baseURL}`, formData);
  }

  updatePost(postId: string, formData: any): Observable<any> {
    return this._http.put(`${this.baseURL}/${postId}`, formData);
  }

  deletePost(postId: string): Observable<any> {
    return this._http.delete(`${this.baseURL}/${postId}`);
  }

  likePost(postId: string): Observable<any> {
    return this._http.put(`${this.baseURL}/${postId}/like`, '');
  }

  bookmarkPost(postId: string): Observable<any> {
    return this._http.put(`${this.baseURL}/${postId}/bookmark`, '');
  }

  sharePost(postId: string, body: { body: string } | ''): Observable<any> {
    return this._http.post(`${this.baseURL}/${postId}/share`, body);
  }
}
