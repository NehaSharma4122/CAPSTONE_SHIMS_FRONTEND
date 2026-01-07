import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  @Output() close = new EventEmitter<void>();

  passwordData = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  isLoading = false;
  message = '';
  isError = false;

  constructor(private authService: AuthService) {}

  onSubmit() {
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.isError = true;
      this.message = "New passwords do not match!";
      return;
    }

    this.isLoading = true;
    this.message = '';

    const payload = {
      oldPassword: this.passwordData.oldPassword,
      newPassword: this.passwordData.newPassword
    };

    this.authService.changePassword(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.isError = false;
        alert("Password Updated Successfully! Please login again.");
        this.authService.logout(); 
        this.closeModal();
      },
      error: (err) => {
        this.isLoading = false;
        this.isError = true;
        this.message = err.error || "Failed to update password.";
      }
    });
  }

  closeModal() {
    this.close.emit();
  }
}