import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseURL = environment.baseUrl;

  private _http = inject(HttpClient);

  register(formBody: any): Observable<any> {
    return this._http.post(`${this.baseURL}/users/signup`, formBody);
  }

  logIn(formBody: any): Observable<any> {
    return this._http.post(`${this.baseURL}/users/signin`, formBody);
  }

  togglePassword(pass: HTMLInputElement, icon: HTMLElement): void {
    if (pass.type === 'password') {
      pass.type = 'text';
      icon.classList.add('fa-eye-slash');
      icon.classList.remove('fa-eye');
    } else {
      pass.type = 'password';
      icon.classList.add('fa-eye');
      icon.classList.remove('fa-eye-slash');
    }
  }
}
