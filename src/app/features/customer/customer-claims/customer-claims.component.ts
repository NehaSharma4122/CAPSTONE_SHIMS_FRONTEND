import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClaimService } from '../../../core/services/claim.service';
import { PolicyService } from '../../../core/services/policy.service';

@Component({
  selector: 'app-customer-claims',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-claims.component.html',
  styleUrls: ['./customer-claims.component.css']
})
export class CustomerClaimsComponent implements OnInit {
  @Input() userId!: number;
  
  claims: any[] = [];
  policies: any[] = []; // For dropdown
  
  // Form Data
  showModal: boolean = false;
  newClaim: any = { policyId: null, diseaseType: '', operationCost: 0, medicineCost: 0, postOpsCost: 0 };

  constructor(
    private claimService: ClaimService,
    private policyService: PolicyService
  ) {}

  ngOnInit() {
    this.loadClaims();
    this.loadPolicies();
  }

  loadClaims() {
    this.claimService.getClaimsByUserId(this.userId).subscribe(data => this.claims = data);
  }

  loadPolicies() {
    this.policyService.getPoliciesByUserId(this.userId).subscribe(data => this.policies = data);
  }

  openModal() {
    this.showModal = true;
  }

  submitClaim() {
    if(!this.newClaim.policyId) return;

    this.claimService.submitClaimByCustomer(this.userId, this.newClaim.policyId, this.newClaim)
      .subscribe({
        next: () => {
          alert("Claim Submitted!");
          this.showModal = false;
          this.loadClaims();
          this.newClaim = { policyId: null, diseaseType: '', operationCost: 0, medicineCost: 0, postOpsCost: 0 };
        },
        error: () => alert("Submission Failed.")
      });
  }
}