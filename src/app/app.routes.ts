import { Routes } from '@angular/router';
import { authGuard } from './core/auth/gaurds/auth-guard.guard';
import { guestGuard } from './core/auth/gaurds/guest-guard.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [guestGuard],
    loadComponent: () => import('./layouts/auth-layout/auth-layout.component').then((m) => m.AuthLayoutComponent),
    children: [
      { path: '', redirectTo: 'register', pathMatch: 'full' },
      {
        path: 'register',
        loadComponent: () => import('./features/register/register.component').then((m) => m.RegisterComponent),
        title: 'register',
      },
      {
        path: 'login',
        loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent),
        title: 'login',
      },
      {
        path: 'forget-password',
        loadComponent: () => import('./features/forget-password/forget-password.component').then((m) => m.ForgetPasswordComponent),
        title: 'forget-password',
      },
    ],
  },

  {
    canActivate: [authGuard],
    path: '',
    loadComponent: () => import('./layouts/user-layout/user-layout.component').then((m) => m.UserLayoutComponent),
    children: [
      // { path: '', redirectTo: 'feed', pathMatch: 'full' },
      {
        path: 'feed',
        loadComponent: () => import('./features/feed/feed.component').then((m) => m.FeedComponent),
        title: 'feed',
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component').then((m) => m.ProfileComponent),
        title: 'profile',
      },
      {
        path: 'profile/:id',
        loadComponent: () => import('./features/global-profile/global-profile.component').then((m) => m.GlobalProfileComponent),
        title: 'profile',
      },
      {
        path: 'notifications',
        loadComponent: () => import('./features/notifications/notifications.component').then((m) => m.NotificationsComponent),
        title: 'Notification',
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/change-password/change-password.component').then((m) => m.ChangePasswordComponent),
        title: 'settings',
      },
      {
        path: 'suggestions',
        loadComponent: () => import('./features/suggestions/suggestions.component').then((m) => m.SuggestionsComponent),
        title: 'suggestions',
      },
      {
        path: 'post/:id',
        loadComponent: () => import('./features/post-details/post-details.component').then((m) => m.PostDetailsComponent),
      },
    ],
  },

  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
    title: 'not found 404 :(',
  },
];
