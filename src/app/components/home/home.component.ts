import { Component, OnInit } from '@angular/core';

import { AuthGuard } from '../../guards/auth.guard';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public button: [string, string];

  constructor(private authGuard: AuthGuard) {}

  ngOnInit(): void {
    if (!this.authGuard.check()) {
      this.button = ['/login', 'Aanmelden'];
    }
  }
}
