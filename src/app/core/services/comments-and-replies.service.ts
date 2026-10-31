import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CommentsAndRepliesService {
  private baseURL = `${environment.baseUrl}/posts`;
  // private authType = environment.authType;

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('userToken');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  private _http = inject(HttpClient);

  getAllPostComments(postId: string, limit: number = 10, page: number = 1): Observable<any> {
    return this._http.get(`${this.baseURL}/${postId}/comments`, {
      headers: this.getAuthHeaders(),
      params: {
        page: page,
        limit: limit,
      },
    });
  }

  createComment(postId: string, formData: FormData): Observable<any> {
    return this._http.post(`${this.baseURL}/${postId}/comments`, formData, {
      headers: this.getAuthHeaders(),
    });
  }

  updateComment(postId: string, commentId: string, formData: FormData): Observable<any> {
    return this._http.put(`${this.baseURL}/${postId}/comments/${commentId}`, formData, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteComment(postId: string, commentId: string): Observable<any> {
    return this._http.delete(`${this.baseURL}/${postId}/comments/${commentId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  likeComment(postId: string, commentId: string): Observable<any> {
    return this._http.put(`${this.baseURL}/${postId}/comments/${commentId}/like`, '', {
      headers: this.getAuthHeaders(),
    });
  }

  // Replies
  getAllCommentReplies(postId: string, commentId: string, limit: number = 10, page: number = 1): Observable<any> {
    return this._http.get(`${this.baseURL}/${postId}/comments/${commentId}/replies`, {
      headers: this.getAuthHeaders(),
      params: {
        page: page,
        limit: limit,
      },
    });
  }

  createReply(postId: string, commentId: string, formData: FormData): Observable<any> {
    return this._http.post(`${this.baseURL}/${postId}/comments/${commentId}/replies`, formData, {
      headers: this.getAuthHeaders(),
    });
  }
}
