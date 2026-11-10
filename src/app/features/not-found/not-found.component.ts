import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
})
export class NotFoundComponent {
  private readonly _location = inject(Location);
  private readonly _router = inject(Router);

  readonly currentPath = this._router.url;

  goBack(): void {
    this._location.back();
  }
}
