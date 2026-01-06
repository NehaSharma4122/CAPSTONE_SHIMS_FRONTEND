import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HospitalService } from '../../../core/services/hospital.service';
import { PlanService } from '../../../core/services/plan.service';
import { ClaimService } from '../../../core/services/claim.service';
import { AuthService } from '../../../core/services/auth.service';
import { HospitalProfileComponent } from '../hospital-profile/hospital-profile.component';

@Component({
  selector: 'app-hospital-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HospitalProfileComponent],
  templateUrl: './hospital-dashboard.component.html',
  styleUrls: ['./hospital-dashboard.component.css']
})
export class HospitalDashboardComponent implements OnInit {
  
  // State
  isLoading: boolean = true;
  isOnboarded: boolean = false;
  activeTab: string = 'profile';

  // Data
  hospitalProfile: any = null;
  linkedPlans: any[] = [];
  availablePlans: any[] = [];
  hospitalClaims: any[] = [];

  // Forms
  onboardData = { name: '', city: '', state: '', address: '', licenseNumber: '', contactEmail: '', contactPhone: '' };
  
  claimData = { policyId: null, diseaseType: '', operationCost: 0, medicineCost: 0, postOpsCost: 0 };
  showClaimModal: boolean = false;

  constructor(
    private hospService: HospitalService,
    private planService: PlanService, // Reusing Plan Service from before
    private claimService: ClaimService, // Reusing Claim Service
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cdr.detectChanges();
    this.checkProfile();
    this.cdr.detectChanges();
  }

  logout() {
    this.authService.logout();
  }

  // --- INITIALIZATION ---
  checkProfile() {
    this.hospService.getProfile().subscribe({
      next: (data) => {
        this.hospitalProfile = data;
        this.isOnboarded = true;
        this.isLoading = false;
        this.loadDashboardData();
        this.cdr.detectChanges();

      },
      error: (err) => {
        // If 404 or 500, assume not onboarded
        this.isOnboarded = false;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadDashboardData() {
    if(!this.hospitalProfile) return;
    const hospId = this.hospitalProfile.id;

    // 1. Get Linked Plans
    this.hospService.getLinkedPlans(hospId).subscribe(data => this.linkedPlans = data);
    this.cdr.detectChanges();

    // 2. Get All Plans (For linking)
    this.planService.getAllPlans().subscribe(data => this.availablePlans = data);
    this.cdr.detectChanges();

    // 3. Get Claims (Using endpoint III)
    // Note: The controller returns ClaimStatsDTO or List<Claim>. 
    // Assuming List<Claim> based on your request "Show all claims".
    // If endpoint III returns stats, we might need a different endpoint for list.
    // Assuming endpoint III returns the list for now.
    this.hospService.getHospitalClaims(hospId).subscribe(data => this.hospitalClaims = data);
    this.cdr.detectChanges();

  }

  // --- ONBOARDING ACTION ---
  submitOnboarding() {
    this.hospService.onboardHospital(this.onboardData).subscribe({
      next: (res) => {
        alert('Onboarding Complete!');
        this.checkProfile(); // Reload to enter dashboard
        this.cdr.detectChanges();
      },
      error: () => {
        alert('Onboarding failed. Please check inputs.')
        this.cdr.detectChanges();
      }
    });
  }

  // --- NETWORK ACTIONS ---
  isPlanLinked(planId: number): boolean {
    return this.linkedPlans.some(p => p.planId === planId); // Check structure of API VI response
  }

  linkPlan(planId: number) {
    this.hospService.linkPlan(this.hospitalProfile.id, planId).subscribe(() => {
      alert('Plan Linked Successfully');
      this.loadDashboardData();
      this.cdr.detectChanges();
    });
  }

  unlinkPlan(planId: number) {
    if(!confirm('Are you sure you want to remove this plan?')) return;
    this.hospService.unlinkPlan(this.hospitalProfile.id, planId).subscribe(() => {
      this.loadDashboardData();
      this.cdr.detectChanges();
    });
  }

  // --- CLAIM ACTIONS ---
  openClaimModal() {
    this.claimData = { policyId: null, diseaseType: '', operationCost: 0, medicineCost: 0, postOpsCost: 0 };
    this.showClaimModal = true;
  }

  submitClaim() {
    if(!this.claimData.policyId) return;
    
    // Call Claim Service (Port 8084)
    // API: /api/claims/hospitals/{hospitalId}/{policyId}
    this.claimService.submitClaimByHospital(
      this.hospitalProfile.id, 
      this.claimData.policyId, 
      this.claimData
    ).subscribe({
      next: () => {
        alert('Claim Submitted Successfully!');
        this.showClaimModal = false;
        this.loadDashboardData(); // Refresh list
      },
      error: (err) => alert('Failed to submit claim. Check Policy ID.')
    });
  }
}