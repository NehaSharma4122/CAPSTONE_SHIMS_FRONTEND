import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PlanService } from '../../../core/services/plan.service';
import { AuthService } from '../../../core/services/auth.service';
import { ManageUserPoliciesComponent } from '../manage-user-policies/manage-user-policies.component';
import { ChangePasswordComponent } from '../../authentication/change-password/change-password.component';

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule,ManageUserPoliciesComponent,ChangePasswordComponent],
  templateUrl: './agent-dashboard.component.html',
  styleUrls: ['./agent-dashboard.component.css']
})
export class AgentDashboardComponent implements OnInit {
  agentName: string = 'Agent';
  agentEmail: string = 'agent@example.com';
  activeTab: 'enroll' | 'manage' = 'enroll';
  plans: any[] = [];
  filteredPlans: any[] = [];
  searchTerm: string = '';
  showPasswordModal: boolean = false;

  constructor(
    private planService: PlanService,
    private authService: AuthService,
    private router: Router,
    private cdr:ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.agentName = this.authService.getUserName();
    this.agentEmail = this.authService.getEmail()
    this.loadPlans();
  }

  loadPlans() {
    this.planService.getAllPlans().subscribe({
      next: (data) => {
        this.plans = data;
        this.filteredPlans = data;
        this.cdr.detectChanges();
      },
      error: (e) => console.error('Error fetching plans', e)
    });
  }

  onSearch() {
    const term = this.searchTerm.toLowerCase();
    this.filteredPlans = this.plans.filter(p => 
      p.id ==term ||
      p.planName.toLowerCase().includes(term) || 
      p.description.toLowerCase().includes(term)
    );
    this.cdr.detectChanges();
  }

  logout() {
    this.authService.logout();
  }

  goToEnroll(planId: number) {
    this.router.navigate(['/agent/enroll', planId]);
  }

  openPasswordModal() {
    this.showPasswordModal = true;
  }
}