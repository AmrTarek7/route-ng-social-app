import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { UserService } from './core/services/user.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('social-app');

  _userService = inject(UserService);

  ngOnInit(): void {
    initFlowbite();
    this._userService.getUserProfile();
  }
}
