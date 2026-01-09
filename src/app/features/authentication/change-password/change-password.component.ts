import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
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

  constructor(private authService: AuthService, private cdr: ChangeDetectorRef) {}

  onSubmit() {
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.isError = true;
      this.message = "New passwords do not match!";
      this.cdr.detectChanges()
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
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.isError = true;
        console.error("Change Password Error:", err);

        if (typeof err.error === 'string') {
            try {
                const parsed = JSON.parse(err.error);
                this.message = parsed.message || parsed.error || err.error;
            } catch (e) {
                this.message = err.error; // It's just a plain string
            }
        } else if (err.error && err.error.message) {
            this.message = err.error.message;
        } else {
            this.message = "Failed to update password. Check old password.";
        }
        this.cdr.detectChanges(); 
      }
    });
  }

  closeModal() {
    this.close.emit();
  }
}