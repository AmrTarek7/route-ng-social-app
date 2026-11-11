import { Component, inject, OnInit } from '@angular/core';
import { NavBarComponent } from '../../shared/ui/nav-bar/nav-bar.component';
import { RouterOutlet } from '@angular/router';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-user-layout',
  imports: [NavBarComponent, RouterOutlet],
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.css',
})
export class UserLayoutComponent implements OnInit {
  _userService = inject(UserService);
  ngOnInit(): void {
    this._userService.getMyProfileInfo();
  }
}
