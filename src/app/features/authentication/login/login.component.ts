import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  loading = false;
  constructor(private authService: AuthService, private router: Router, private cdr: ChangeDetectorRef) {}

  onSubmit() {
    this.loading = true;
    this.authService.login(this.credentials).subscribe({
      next: (res) => {
        this.redirectUser(res.role);
        this.cdr.detectChanges();
      },
      error: (err) => {
        alert('Login failed! Please check credentials.');
        this.loading = false;
      }
    });
  }

  redirectUser(role: string) {
    // Automatic Role Detection & Routing
    switch(role) {
      case 'ROLE_ADMIN':
        this.router.navigate(['/admin/dashboard']);
        this.cdr.detectChanges();
        break;
      case 'ROLE_HOSPITAL':
        this.router.navigate(['/hospital/dashboard']); 
        this.cdr.detectChanges();
        break;
      case 'ROLE_AGENT':
        this.router.navigate(['/agent/dashboard']); 
        this.cdr.detectChanges();
        break;
      case 'ROLE_CLAIMS_OFFICER':
        this.router.navigate(['/claimoff/dashboard']);
        this.cdr.detectChanges();
        break;
      case 'ROLE_CUSTOMER':
        this.router.navigate(['/customer/dashboard']);
        this.cdr.detectChanges();
        break;
      default:
        this.router.navigate(['/products/plans']); // Customer goes to browse plans
    }
  }
}

