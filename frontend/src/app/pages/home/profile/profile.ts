import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { User } from '../../../models/user';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.html'
})
export class ProfileComponent implements OnInit {
  user: User | null = null;

  constructor(
    public router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    this.user = this.authService.getCurrentUser();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
