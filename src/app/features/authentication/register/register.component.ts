import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'] // Reusing login styles
})
export class RegisterComponent {
  user = { username: '', email: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.user.username || !this.user.email || !this.user.password) {
      return;
    }
    this.authService.register(this.user).subscribe({
      next: () => {
        alert('Registration successful! Please login.');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        alert('Registration failed. Email might already exist.');
      }
    });
  }
}