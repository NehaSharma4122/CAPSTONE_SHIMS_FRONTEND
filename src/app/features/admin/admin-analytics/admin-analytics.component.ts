import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { forkJoin } from 'rxjs';
import { AdminService } from '../../../core/services/admin.service';
import { PlanService } from '../../../core/services/plan.service';
import { ClaimService } from '../../../core/services/claim.service';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-analytics.component.html',
  styleUrls: ['./admin-analytics.component.css']
})
export class AdminAnalyticsComponent implements OnInit, OnDestroy {

  // Totals
  totalUsers: number = 0;
  totalPlans: number = 0;
  totalClaims: number = 0;

  // Chart Instances (to destroy them later if needed)
  userChart: any;
  claimChart: any;

  constructor(
    private adminService: AdminService,
    private planService: PlanService,
    private claimService: ClaimService,
    private cdr:ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadDataAndRender();
  }

  loadDataAndRender() {
    // Fetch all data in parallel
    forkJoin({
      users: this.adminService.getAllUsers(),
      plans: this.planService.getAllPlans(),
      claims: this.claimService.getAllClaims()
    }).subscribe({
      next: (res) => {
        // 1. Set Totals
        this.totalUsers = res.users.length;
        this.totalPlans = res.plans.length;
        this.totalClaims = res.claims.length;
        this.cdr.detectChanges();

        // 2. Process Data for Charts
        this.renderUserChart(res.users);
        this.renderClaimChart(res.claims);
      },
      error: (err) => console.error('Failed to load analytics data', err)
    });
  }

  // --- CHART 1: USER DISTRIBUTION (Pie Chart) ---
  renderUserChart(users: any[]) {
    // Count Roles
    let roleCounts: any = { 'CUSTOMER': 0, 'AGENT': 0, 'HOSPITAL': 0, 'CLAIMS_OFFICER': 0, 'ADMIN': 0 };
    
    users.forEach(u => {
      // Remove 'ROLE_' prefix if present for cleaner keys
      const role = u.role.replace('ROLE_', '');
      if (roleCounts[role] !== undefined) roleCounts[role]++;
      else roleCounts['OTHER'] = (roleCounts['OTHER'] || 0) + 1;
    });

    const ctx = document.getElementById('userChart') as HTMLCanvasElement;
    
    this.userChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Customers', 'Agents', 'Hospitals', 'Officers', 'Admins'],
        datasets: [{
          data: [
            roleCounts['CUSTOMER'], 
            roleCounts['AGENT'], 
            roleCounts['HOSPITAL'], 
            roleCounts['CLAIMS_OFFICER'], 
            roleCounts['ADMIN']
          ],
          backgroundColor: ['#4caf50', '#ff9800', '#2196f3', '#9c27b0', '#f44336'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: 'User Demographics' }
        }
      }
    });
  }

  // --- CHART 2: CLAIM STAGES (Bar Chart) ---
  renderClaimChart(claims: any[]) {
    // Count Statuses
    let statusCounts: any = { 'SUBMITTED': 0, 'IN_REVIEW': 0, 'APPROVED': 0, 'PAID': 0, 'REJECTED': 0 };

    claims.forEach(c => {
      // Ensure backend field matches (claimStatus or status)
      const status = c.claimStatus || c.status; 
      if (status && statusCounts[status] !== undefined) {
        statusCounts[status]++;
      }
    });

    const ctx = document.getElementById('claimChart') as HTMLCanvasElement;

    this.claimChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Submitted', 'In Review', 'Approved', 'Paid', 'Rejected'],
        datasets: [{
          label: 'Number of Claims',
          data: [
            statusCounts['SUBMITTED'],
            statusCounts['IN_REVIEW'],
            statusCounts['APPROVED'],
            statusCounts['PAID'],
            statusCounts['REJECTED']
          ],
          backgroundColor: [
            '#90caf9', // Submitted
            '#ffcc80', // Review
            '#a5d6a7', // Approved
            '#80cbc4', // Paid
            '#ef9a9a'  // Rejected
          ],
          borderRadius: 5
        }]
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } },
        plugins: {
          legend: { display: false }, // Hide label since it's obvious
          title: { display: true, text: 'Claims Pipeline' }
        }
      }
    });
  }

  ngOnDestroy() {
    // Cleanup charts to prevent memory leaks
    if (this.userChart) this.userChart.destroy();
    if (this.claimChart) this.claimChart.destroy();
  }
}