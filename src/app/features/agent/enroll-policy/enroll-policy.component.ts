import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanService } from '../../../core/services/plan.service';
import { PolicyService } from '../../../core/services/policy.service';

@Component({
  selector: 'app-enroll-policy',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './enroll-policy.component.html',
  styleUrls: ['./enroll-policy.component.css']
})
export class EnrollPolicyComponent implements OnInit {
  planId!: number;
  plan: any = null;
  
  // Form Data
  userEmail: string = '';
  foundUserId: number | null = null;
  foundUserName: string = ''; // New: Store username to show confirmation
  userSearchStatus: 'idle' | 'searching' | 'found' | 'error' = 'idle';
  errorMessage: string = '';
  isLoading: boolean = false; // NEW: Controls UI lag
  enrollmentSuccess: boolean = false;
  createdPolicy: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private planService: PlanService,
    private policyService: PolicyService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.planId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPlanDetails();
  }

  loadPlanDetails() {
    // Assuming PlanService has getPlanById (public or admin endpoint)
    // If not, use inventory and find.
    this.planService.getAllPlans().subscribe(plans => {
      this.plan = plans.find(p => p.id === this.planId);
    });
  }

  verifyUser() {
    // 1. Basic Validation
    if (!this.userEmail) {
      this.handleError("Please enter an email address.");
      return;
    }
    
    // Prevent double clicks
    if (this.isLoading) return;

    // 2. Start Loading / Reset States
    this.isLoading = true;
    this.userSearchStatus = 'idle'; // Reset to idle so input doesn't get stuck
    this.errorMessage = '';
    this.foundUserId = null;

    // 3. Call API
    this.policyService.lookupUserByEmail(this.userEmail).subscribe({
      next: (user: any) => {
        // Stop loading immediately on response
        this.isLoading = false;

        // Validation: Did we get a user?
        if (!user || !user.userId) {
            this.handleError("User not found with this email.");
            return;
        }

        // Validation: Is it a Customer?
        if (user.role !== 'ROLE_CUSTOMER') {
            this.handleError(`User found but is NOT a customer (Role: ${user.role}).`);
            return;
        }

        // Success Path
        this.foundUserId = user.userId; 
        this.foundUserName = user.username;
        this.userSearchStatus = 'found';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("API Error:", err);
        
        let msg = "User not found.";
        if (err.status === 404) msg = "No account found with this email.";
        else if (err.status === 0) msg = "Network error. Check your connection.";
        else if (err.status === 500) msg = "Server error. Please try again.";
        
        this.handleError(msg);
        this.cdr.detectChanges();
      }
    });
  }

  handleError(msg: string) {
    this.errorMessage = msg;
    this.userSearchStatus = 'error';
    this.isLoading = false; 
    this.cdr.detectChanges();
  }
  
  // Manual override if API missing
  // manualIdSet(id: string) {
  //     if(!id) return;
  //     this.foundUserId = Number(id);
  //     this.foundUserName = 'Manual Entry';
  //     this.userSearchStatus = 'found';
  //     this.isLoading=false;
  // }

  // STEP 2: Enroll
  confirmEnrollment() {
    if(!this.foundUserId || !this.planId || this.isLoading) return;

    this.isLoading = true; // Lock button

    this.policyService.enrollPolicy(this.foundUserId, this.planId).subscribe({
      next: (policy) => {
        this.enrollmentSuccess = true;
        this.createdPolicy = policy;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        alert('Enrollment failed. User might already be enrolled.');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goBack() {
    this.router.navigate(['/agent/dashboard']);
  }
}