import { Component, OnInit } from '@angular/core';

import { AuthGuard } from '../../guards/auth.guard';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public loggedIn: boolean;

  constructor(private authGuard: AuthGuard) {}

  ngOnInit(): void {
    this.loggedIn = this.authGuard.check();
  }
}
