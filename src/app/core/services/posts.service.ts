import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private baseURL = `${environment.baseUrl}/posts`;
  // private authType = environment.authType;
  private TOKEN = localStorage.getItem('userToken');

  private _http = inject(HttpClient);

  getAllPosts(): Observable<any> {
    return this._http.get(`${this.baseURL}`, {
      headers: {
        Authorization: `Bearer ${this.TOKEN}`,
      },
    });
  }

  getFeedPosts(limit: number = 20, page: number = 1): Observable<any> {
    return this._http.get(`${this.baseURL}/feed?only=following&limit=${limit}&page=${page}`, {
      headers: {
        Authorization: `Bearer ${this.TOKEN}`,
      },
    });
  }

  getPostDetails(postId: string): Observable<any> {
    return this._http.get(`${this.baseURL}/${postId}`, {
      headers: {
        Authorization: `Bearer ${this.TOKEN}`,
      },
    });
  }

  getPostLikes(postId: string, limit: number = 20, page: number = 1): Observable<any> {
    return this._http.get(`${this.baseURL}/${postId}/likes?limit=${limit}&page=${page}`, {
      headers: {
        Authorization: `Bearer ${this.TOKEN}`,
      },
    });
  }

  createPost(formData: any): Observable<any> {
    return this._http.post(`${this.baseURL}`, formData, {
      headers: {
        Authorization: `Bearer ${this.TOKEN}`,
      },
    });
  }

  updatePost(postId: string, formData: any): Observable<any> {
    return this._http.put(`${this.baseURL}/${postId}`, formData, {
      headers: {
        Authorization: `Bearer ${this.TOKEN}`,
      },
    });
  }

  deletePost(postId: string): Observable<any> {
    return this._http.delete(`${this.baseURL}/${postId}`, {
      headers: {
        Authorization: `Bearer ${this.TOKEN}`,
      },
    });
  }

  likePost(postId: string): Observable<any> {
    return this._http.put(`${this.baseURL}/${postId}/like`, '', {
      headers: {
        Authorization: `Bearer ${this.TOKEN}`,
      },
    });
  }

  bookmarkPost(postId: string): Observable<any> {
    return this._http.put(`${this.baseURL}/${postId}/bookmark`, '', {
      headers: {
        Authorization: `Bearer ${this.TOKEN}`,
      },
    });
  }

  sharePost(postId: string, formData: { body: string | null }): Observable<any> {
    return this._http.post(`${this.baseURL}/${postId}/share`, formData, {
      headers: {
        Authorization: `Bearer ${this.TOKEN}`,
      },
    });
  }
}
