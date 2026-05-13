import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navigation.html',
})
export class NavigationComponent implements OnInit {
  userRole: string = '';

  constructor(
    public router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.userRole = this.authService.getUserRole();
  }
}
