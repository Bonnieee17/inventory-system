import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-2xl mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-white">InvenTrack</h1>
          <p class="text-blue-200 mt-2">Create your account</p>
        </div>

        <div class="bg-white rounded-2xl shadow-2xl p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Create account</h2>

          @if (errorMsg()) {
            <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {{ errorMsg() }}
            </div>
          }

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Full name</label>
              <input type="text" formControlName="name"
                class="input-field"
                [class.input-error]="isInvalid('name')"
                placeholder="John Doe">
              @if (isInvalid('name')) {
                <p class="mt-1 text-xs text-red-600">Name must be at least 2 characters</p>
              }
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input type="email" formControlName="email"
                class="input-field"
                [class.input-error]="isInvalid('email')"
                placeholder="you@example.com">
              @if (isInvalid('email')) {
                <p class="mt-1 text-xs text-red-600">Please enter a valid email</p>
              }
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" formControlName="password"
                class="input-field"
                [class.input-error]="isInvalid('password')"
                placeholder="At least 6 characters">
              @if (isInvalid('password')) {
                <p class="mt-1 text-xs text-red-600">Password must be at least 6 characters</p>
              }
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
              <input type="password" formControlName="confirmPassword"
                class="input-field"
                [class.input-error]="isInvalid('confirmPassword') || passwordMismatch()"
                placeholder="Repeat password">
              @if (passwordMismatch()) {
                <p class="mt-1 text-xs text-red-600">Passwords do not match</p>
              }
            </div>

            <button type="submit" [disabled]="loading()"
              class="btn-primary w-full flex items-center justify-center">
              @if (loading()) {
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Creating account...
              } @else {
                Create account
              }
            </button>
          </form>

          <p class="mt-6 text-center text-sm text-gray-600">
            Already have an account?
            <a routerLink="/login" class="text-blue-600 hover:text-blue-700 font-medium">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  loading = signal(false);
  errorMsg = signal('');

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  });

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && control?.touched);
  }

  passwordMismatch(): boolean {
    const { password, confirmPassword } = this.form.getRawValue();
    return !!(this.form.get('confirmPassword')?.touched && password !== confirmPassword);
  }

  onSubmit(): void {
    if (this.form.invalid || this.passwordMismatch()) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMsg.set('');

    const { name, email, password } = this.form.getRawValue();

    this.authService.register(name, email, password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err: Error) => {
        this.errorMsg.set(err.message);
        this.loading.set(false);
      },
    });
  }
}
