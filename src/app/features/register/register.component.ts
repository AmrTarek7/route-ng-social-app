import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  _authService = inject(AuthService);
  _routerService = inject(Router);

  errorMsg = signal('');
  loading = signal(false);

  // --------------------------------------------
  //   {
  //   "name": "Ahmed Yhaya",
  //   "username": "Ahmed87153",
  //   "email": "ahmed7613@gmail.com",
  //   "dateOfBirth": "2000-01-01",
  //   "gender": "male",
  //   "password": "Aa@123456",
  //   "rePassword": "Aa@123456"
  // }

  registerForm = new FormGroup(
    {
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      dateOfBirth: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]),
      rePassword: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]),
    },
    { validators: [this.validatePasswordsMatch] },
    // { updateOn: 'submit' },
  );

  validatePasswordsMatch(formGroup: AbstractControl) {
    const password = formGroup.get('password');
    const rePassword = formGroup.get('rePassword');
    if (password?.value !== rePassword?.value) {
      rePassword?.setErrors({ passwordsDoNotMatch: true });
      return { passwordsDoNotMatch: true };
    } else {
      rePassword?.setErrors(null);
      return null;
    }
  }

  register(): void {
    if (this.registerForm.valid) {
      console.log('form valid');
      console.log(this.registerForm);

      this.loading.set(true);

      this._authService.register(this.registerForm.value).subscribe({
        next: (res) => {
          console.log(res);
          this.loading.set(false);
          this.registerForm.reset();
          this.errorMsg.set('');
          this._routerService.navigate(['/login']);
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMsg.set(err.error.message);
          console.log(err);
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
      this.registerForm.markAllAsDirty();
    }
  }
}
