import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CommentsAndRepliesService {
  private baseURL = `${environment.baseUrl}/posts`;

  private _http = inject(HttpClient);

  getAllPostComments(postId: string, limit: number = 10, page: number = 1): Observable<any> {
    return this._http.get(`${this.baseURL}/${postId}/comments`, {
      params: {
        page: page,
        limit: limit,
      },
    });
  }

  createComment(postId: string, formData: FormData): Observable<any> {
    return this._http.post(`${this.baseURL}/${postId}/comments`, formData);
  }

  updateComment(postId: string, commentId: string, formData: FormData): Observable<any> {
    return this._http.put(`${this.baseURL}/${postId}/comments/${commentId}`, formData);
  }

  deleteComment(postId: string, commentId: string): Observable<any> {
    return this._http.delete(`${this.baseURL}/${postId}/comments/${commentId}`);
  }

  likeComment(postId: string, commentId: string): Observable<any> {
    return this._http.put(`${this.baseURL}/${postId}/comments/${commentId}/like`, '');
  }

  // Replies
  getAllCommentReplies(postId: string, commentId: string, limit: number = 10, page: number = 1): Observable<any> {
    return this._http.get(`${this.baseURL}/${postId}/comments/${commentId}/replies`, {
      params: {
        page: page,
        limit: limit,
      },
    });
  }

  createReply(postId: string, commentId: string, formData: FormData): Observable<any> {
    return this._http.post(`${this.baseURL}/${postId}/comments/${commentId}/replies`, formData);
  }
}
