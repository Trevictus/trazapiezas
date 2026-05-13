import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.html'
})
export class NavbarComponent implements OnInit {
  constructor(public router: Router) { }

  pageTitle: string = '';

  titleMap: { [key: string]: string } = {
    'dashboard': '',
    'inventory': 'ALMACÉN',
    'warehouse': 'ESTANTERÍAS',
    'history': 'MOVIMIENTOS',
    'profile': 'PERFIL'
  };

  ngOnInit() {
    this.router.events.subscribe(() => {
      const path = this.router.url.split('/')[1] || 'home';
      this.pageTitle = this.titleMap[path] || '';
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}