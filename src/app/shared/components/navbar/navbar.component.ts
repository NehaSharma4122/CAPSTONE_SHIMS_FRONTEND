import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  username: string = '';

  constructor(private authService: AuthService, private router: Router) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  ngOnInit() {
    this.isLoggedIn$.subscribe(loggedIn => {
      if(loggedIn) {
        this.username = this.authService.getUserName();
      }
    });
  }

  logout() {
    this.authService.logout();
  }

  goToDashboard() {
    const role = this.authService.getRole();
    if(role === 'ROLE_ADMIN') this.router.navigate(['/admin/dashboard']);
    else if(role === 'ROLE_CUSTOMER') this.router.navigate(['/products/plans']);
    else if(role === 'ROLE_AGENT') this.router.navigate(['/agent/dashboard']);

    else this.router.navigate(['/']); 
  }
}