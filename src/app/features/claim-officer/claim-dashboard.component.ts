import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ClaimService } from '../../core/services/claim.service';

@Component({
  selector: 'app-claim-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './claim-dashboard.component.html',
  styleUrls: ['./claim-dashboard.component.css']
})
export class ClaimOfficerDashboardComponent implements OnInit {
  
  officerName: string = 'Officer';
  officerEmail: string = '';
  
  // Tabs: 'all', 'submitted', 'in_review', 'approved', 'paid', 'rejected'
  activeTab: string = 'all'; 
  
  claims: any[] = [];
  searchId: string = ''; // Can be Claim ID or User ID based on logic

  constructor(
    private authService: AuthService,
    private claimService: ClaimService,
    private router: Router,
    private cdr : ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.officerName = this.authService.getUserName();
    // Assuming you store email in localstorage or get it from auth service
    const userStr = localStorage.getItem('user');
    if(userStr) this.officerEmail = JSON.parse(userStr).email;

    this.loadClaims();
  }

  logout() {
    this.authService.logout();
  }

  // --- DATA LOADING ---
  setTab(tab: string) {
    this.activeTab = tab;
    this.searchId = ''; // Reset search on tab change
    this.loadClaims();
  }

  loadClaims() {
    let request;

    if (this.activeTab === 'all') {
      request = this.claimService.getAllClaims();
      this.cdr.detectChanges();
    } else {
      request = this.claimService.getClaimsByStatus(this.activeTab);
      this.cdr.detectChanges();
    }

    request.subscribe({
      next: (data) => this.claims = data,
      error: (e) => console.error(e)
    });
  }

  // --- SEARCH LOGIC ---
  search() {
    if(!this.searchId) {
      this.loadClaims();
      return;
    }

    const id = Number(this.searchId);
    
    this.claimService.getClaimsByUserId(id).subscribe({
      next: (data) => this.claims = data,
      error: () => {
        // Fallback: Try Claim ID
        this.claimService.getClaimById(id).subscribe({
          next: (claim) => this.claims = [claim],
          error: () => alert('No claims found for this User ID or Claim ID')
        });
      }
    });
  }

  // --- WORKFLOW ACTIONS ---
  
  // 1. Submitted -> Review
  moveToReview(id: number) {
    if(!confirm('Move this claim to Review?')) return;
    this.claimService.markInReview(id).subscribe(() => this.loadClaims());
    this.cdr.detectChanges();
  }

  // 2. Review -> Approve
  approveClaim(id: number) {
    if(!confirm('Approve this claim? This will authorize payment.')) return;
    this.claimService.markApproved(id).subscribe(() => this.loadClaims());
    this.cdr.detectChanges();

  }

  // 3. Review -> Reject
  rejectClaim(id: number) {
    if(!confirm('Reject this claim?')) return;
    this.claimService.markRejected(id).subscribe(() => this.loadClaims());
    this.cdr.detectChanges();

  }

  // 4. Approve -> Paid
  processPayment(id: number) {
    if(!confirm('Mark this claim as Paid? Funds will be released.')) return;
    this.claimService.markPaid(id).subscribe(() => this.loadClaims());
    this.cdr.detectChanges();
  }

  // Helper for Badge Colors
  getStatusClass(status: string): string {
    switch(status) {
      case 'SUBMITTED': return 'badge-blue';
      case 'IN_REVIEW': return 'badge-orange';
      case 'APPROVED': return 'badge-green';
      case 'PAID': return 'badge-teal';
      case 'REJECTED': return 'badge-red';
      default: return 'badge-gray';
    }
  }
}