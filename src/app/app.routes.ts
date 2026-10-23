import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { RegisterComponent } from './features/register/register.component';
import { LoginComponent } from './features/login/login.component';
import { ChangePasswordComponent } from './features/change-password/change-password.component';
import { ForgetPasswordComponent } from './features/forget-password/forget-password.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { FeedComponent } from './features/feed/feed.component';
import { ProfileComponent } from './features/profile/profile.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { NotificationComponent } from './features/notification/notification.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: 'register', pathMatch: 'full' },
      { path: 'register', component: RegisterComponent, title: 'register' },
      { path: 'login', component: LoginComponent, title: 'login' },
      { path: 'forget-password', component: ForgetPasswordComponent, title: 'forget-password' },
    ],
  },

  {
    path: '',
    component: UserLayoutComponent,
    children: [
      // { path: '', redirectTo: 'feed', pathMatch: 'full' },
      { path: 'feed', component: FeedComponent, title: 'feed' },
      { path: 'profile', component: ProfileComponent, title: 'profile' },
      { path: 'notifications', component: NotificationComponent, title: 'Notification' },
      { path: 'settings', component: ChangePasswordComponent, title: 'change-password' },
    ],
  },

  { path: '**', component: NotFoundComponent, title: 'not found 404 :(' },
];
