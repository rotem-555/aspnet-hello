import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SignalRService } from '../../core/services/signalr.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  isAdmin = false;
  username = '';

  constructor(private authService: AuthService, private router: Router, private signalRService: SignalRService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.isAdmin = user?.role === 'Admin';
      this.username = user?.username || '';
    });
  }

  logout(): void {
    this.authService.logout();
    this.signalRService.onUserLogout();
    this.router.navigate(['/login']);
  }
}

