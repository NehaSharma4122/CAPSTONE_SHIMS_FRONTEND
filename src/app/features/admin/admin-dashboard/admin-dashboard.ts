import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { AuthService } from '../../../core/services/auth.service'; // Import AuthService
import { ManagePlansComponent } from '../manage-plans/manage-plans.component';
import { ManagePoliciesComponent } from '../manage-policies/manage-policies.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule,ManagePlansComponent,ManagePoliciesComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  activeTab: string = 'users';
  users: any[] = [];
  adminName: string = 'Admin'; // Default name
  adminEmail: string = 'admin@insureplus.com'

  // Creation Form Data
  creationType: 'agent' | 'claim' | 'hospital' = 'agent';
  newUser = { username: '', email: '', password: '', organizationId: '' };

  // Role Update Modal Data
  showRoleModal: boolean = false;
  selectedUserForRoleUpdate: any = null;
  selectedNewRole: string = '';
  
  availableRoles = ['ROLE_ADMIN', 'ROLE_AGENT', 'ROLE_CLAIMS_OFFICER', 'ROLE_HOSPITAL', 'ROLE_CUSTOMER'];

  constructor(
    private adminService: AdminService,
    private authService: AuthService, 
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.adminName = this.authService.getUserName();
    this.adminEmail = this.authService.getEmail();

  }

  loadUsers() {
    this.adminService.getAllUsers().subscribe({
      next: (data) => this.users = data,
      error: (e) => console.error('Error fetching users', e)
    });
  }

  logout() {
    this.authService.logout();
  }

  // ... (Keep deleteUser, openRoleModal, closeRoleModal, confirmRoleChange as they were) ...
  deleteUser(userId: number) {
    if(confirm('Are you sure you want to delete this user?')) {
      this.adminService.deleteUser(userId).subscribe(() => {
        this.users = this.users.filter(u => u.id !== userId);
      });
    }
  }

  openRoleModal(user: any) {
    this.selectedUserForRoleUpdate = user;
    this.selectedNewRole = user.role; 
    this.showRoleModal = true;
  }

  closeRoleModal() {
    this.showRoleModal = false;
    this.selectedUserForRoleUpdate = null;
  }

  confirmRoleChange() {
    if (!this.selectedUserForRoleUpdate) return;
    this.adminService.updateUserRole(this.selectedUserForRoleUpdate.userId, this.selectedNewRole)
      .subscribe({
        next: (res) => {
          alert('Role updated successfully');
          this.loadUsers(); 
          this.closeRoleModal();
        },
        error: (err) => alert('Failed to update role')
      });
  }

  onSubmitCreate() {
    let request;
    if (this.creationType === 'agent') request = this.adminService.createAgent(this.newUser);
    else if (this.creationType === 'claim') request = this.adminService.createClaimOfficer(this.newUser);
    else request = this.adminService.createHospital(this.newUser);

    request.subscribe({
      next: () => {
        alert(`${this.creationType.toUpperCase()} created successfully!`);
        this.newUser = { username: '', email: '', password: '', organizationId: '' };
        this.loadUsers();
        this.activeTab = 'users';
      },
      error: (err) => alert('Failed to create user.')
    });
  }
}