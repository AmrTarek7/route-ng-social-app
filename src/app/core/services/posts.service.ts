import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private baseURL = environment.baseUrl;

  private _http = inject(HttpClient);

  getAllPosts(): Observable<any> {
    // return this._http.get(`${this.baseURL}/posts/feed?only=following&limit=20&page=1`, {
    return this._http.get(`${this.baseURL}/posts`, {
      headers: {
        Authorization: `${localStorage.getItem('userToken')}`,
      },
    });
  }
}
