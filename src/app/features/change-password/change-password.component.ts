import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { LucideKeyRound } from '@lucide/angular';
import { AuthService } from '../../core/auth/service/auth.service';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule, LucideKeyRound],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent {
  _authService = inject(AuthService);

  changePasswordForm = new FormGroup(
    {
      currentPassword: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]),
      newPassword: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]),
      confirmNewPassword: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]),
    },
    { validators: this.validatePasswordsMatch },
  );

  errorMsg = signal('');
  successMsg = signal('');
  loading = signal(false);

  validatePasswordsMatch(formGroup: AbstractControl): ValidationErrors | null {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmNewPassword = formGroup.get('confirmNewPassword')?.value;

    if (newPassword !== confirmNewPassword) {
      return { passwordsDoNotMatch: true };
    }

    return null;
  }

  submitChangePassword(): void {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      this.changePasswordForm.markAllAsDirty();
      return;
    }

    const formValue = {
      password: this.changePasswordForm.get('currentPassword')?.value,
      newPassword: this.changePasswordForm.get('newPassword')?.value,
    };

    this.loading.set(true);

    this._authService.changePassword(formValue).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.changePasswordForm.reset();
        this.successMsg.set(res.message);
        localStorage.setItem('userToken', res.data.token);

        this.errorMsg.set('');
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMsg.set(err?.error?.message);
        this.successMsg.set('');
      },
    });
  }
}
