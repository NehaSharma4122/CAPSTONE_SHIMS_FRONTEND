import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Required for Renew Modal input
import { PolicyService } from '../../../core/services/policy.service';

@Component({
  selector: 'app-customer-policies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-policies.component.html',
  styleUrls: ['./customer-policies.component.css']
})
export class CustomerPoliciesComponent implements OnInit {
  @Input() userId!: number;
  policies: any[] = [];

  // Renewal State
  showRenewModal: boolean = false;
  selectedPolicyId: number | null = null;
  renewRemarks: string = 'Customer Self-Renewal'; // Default remark

  constructor(
    private policyService: PolicyService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if(this.userId) {
      this.loadPolicies();
    }
  }

  loadPolicies() {
    this.policyService.getPoliciesByUserId(this.userId).subscribe({
      // You MUST use the 'next:' key here
      next: (data) => {
        this.policies = data;
        this.cdr.detectChanges(); 
      },
      // You MUST use the 'error:' key here
      error: (err) => {
        console.error('Failed to load policies', err);
      }
    });
  }

  // --- SUSPEND / ACTIVATE LOGIC ---
  toggleStatus(p: any) {
    const isActive = p.policyStatus === 'ACTIVE';
    const action = isActive ? 'Suspend' : 'Activate';

    if (!confirm(`Are you sure you want to ${action} this policy?`)) return;

    // Determine API call based on current status
    const action$ = isActive 
      ? this.policyService.suspendPolicy(this.userId, p.id)
      : this.policyService.activatePolicy(this.userId, p.id);

    action$.subscribe({
      next: () => {
        alert(`Policy ${action} successfully.`); // "Suspended" or "Activated"
        this.loadPolicies(); // Refresh list to show new status
      },
      error: (err) => {
        console.error(err);
        alert(`Failed to ${action} policy.`);
      }
    });
  }

  // --- RENEWAL LOGIC ---
  openRenewModal(policyId: number) {
    this.selectedPolicyId = policyId;
    this.renewRemarks = 'Customer Self-Renewal'; // Reset remark
    this.showRenewModal = true;
  }

  closeModal() {
    this.showRenewModal = false;
    this.selectedPolicyId = null;
  }

  confirmRenew() {
    if (!this.selectedPolicyId) return;

    this.policyService.renewPolicy(this.userId, this.selectedPolicyId, this.renewRemarks)
      .subscribe({
        next: (res) => {
          alert('Policy Renewed Successfully!');
          this.closeModal();
          this.loadPolicies(); // Refresh list to show updated dates/count
        },
        error: (err) => {
          console.error(err);
          alert('Renewal failed.');
        }
      });
  }
}