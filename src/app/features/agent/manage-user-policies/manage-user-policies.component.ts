import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PolicyService } from '../../../core/services/policy.service';

@Component({
  selector: 'app-manage-user-policies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-user-policies.component.html',
  styleUrls: ['./manage-user-policies.component.css']
})
export class ManageUserPoliciesComponent {
  
  // Search State
  userEmail: string = '';
  foundUser: any = null;
  isLoadingUser: boolean = false;
  searchError: string = '';

  // Policies State
  userPolicies: any[] = [];
  isLoadingPolicies: boolean = false;

  // Action State (Renew Modal)
  showRenewModal: boolean = false;
  selectedPolicyId: number | null = null;
  renewRemarks: string = 'Standard Renewal';

  constructor(
    private policyService: PolicyService,
    private cdr: ChangeDetectorRef
  ) {}

  // 1. Search User by Email
  searchUser() {
    if (!this.userEmail) return;
    
    this.isLoadingUser = true;
    this.searchError = '';
    this.foundUser = null;
    this.userPolicies = [];

    this.policyService.lookupUserByEmail(this.userEmail).subscribe({
      next: (user: any) => {
        this.isLoadingUser = false;
        
        if (!user || user.role !== 'ROLE_CUSTOMER') {
          this.searchError = 'User not found or is not a Customer.';
          this.cdr.detectChanges();
          return;
        }

        this.foundUser = user;
        this.loadPolicies(user.userId);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoadingUser = false;
        this.searchError = 'User not found.';
        this.cdr.detectChanges();
      }
    });
  }

  // 2. Load Policies for that User
  loadPolicies(userId: number) {
    this.isLoadingPolicies = true;
    this.policyService.getPoliciesByUserId(userId).subscribe({
      next: (data) => {
        this.userPolicies = data;
        this.isLoadingPolicies = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoadingPolicies = false;
        this.cdr.detectChanges();
      }
    });
  }

  // 3. Suspend Policy (Status Toggle Logic)
  toggleStatus(policy: any) {
    if(!this.foundUser) return;

    // determine action based on current status
    const isActive = policy.policyStatus === 'ACTIVE';
    const action = isActive ? 'Suspend' : 'Activate';

    if(!confirm(`Are you sure you want to ${action} this policy?`)) return;

    // Create the Observable based on action
    const apiCall$ = isActive 
      ? this.policyService.suspendPolicy(this.foundUser.userId, policy.id)
      : this.policyService.activatePolicy(this.foundUser.userId, policy.id);

    // Execute
    apiCall$.subscribe({
      next: (res) => {
        alert(`Policy ${action} successfully.`); // "Suspended" or "Activated"
        this.loadPolicies(this.foundUser.userId); // Refresh list
      },
      error: (err) => {
        console.error(err);
        alert(`Failed to ${action} policy.`);
      }
    });
  }

  // 4. Renew Logic
  openRenewModal(policyId: number) {
    this.selectedPolicyId = policyId;
    this.showRenewModal = true;
  }

  confirmRenew() {
    if (!this.selectedPolicyId || !this.foundUser) return;

    this.policyService.renewPolicy(this.foundUser.userId, this.selectedPolicyId, this.renewRemarks)
      .subscribe({
        next: (res) => {
          alert('Policy Renewed Successfully!');
          this.showRenewModal = false;
          this.loadPolicies(this.foundUser.userId);
        },
        error: () => alert('Renewal failed.')
      });
  }

  closeModal() {
    this.showRenewModal = false;
  }
}