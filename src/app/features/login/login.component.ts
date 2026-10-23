import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../core/auth/service/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  _authService = inject(AuthService);
  _routerService = inject(Router);

  errorMsg = signal('');
  loading = signal(false);

  loginForm = new FormGroup(
    {
      login: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]),
    }, // { updateOn: 'submit' },
  );

  login(): void {
    //
    if (this.loginForm.valid) {
      console.log(this.loginForm);
      this.loading.set(true);

      this._authService.logIn(this.loginForm.value).subscribe({
        next: (res) => {
          console.log(res);
          this.loading.set(false);

          this.loginForm.reset();
          this.errorMsg.set('');

          this._routerService.navigate(['/feed']);

          localStorage.setItem('userToken', `${res.data.token}`);
          localStorage.setItem('routeUserInfo', JSON.stringify(res.data.user));
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMsg.set(err.error.message);
          console.log(err);
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
      this.loginForm.markAllAsDirty();
    }
  }
}
