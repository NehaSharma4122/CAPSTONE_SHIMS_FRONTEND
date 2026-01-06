import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanService } from '../../../core/services/plan.service';
import { PolicyService } from '../../../core/services/policy.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-plans',
  standalone: true,
  imports: [CommonModule],
  templateUrl:'./customer-plans.component.html',
  styleUrls:['./customer-plans.component.css']
})
export class CustomerPlansComponent implements OnInit {
  @Input() userId!: number;
  plans: any[] = [];

  constructor(
    private planService: PlanService,
    private policyService: PolicyService,
    private router: Router
  ) {}

  ngOnInit() {
    this.planService.getAllPlans().subscribe(data => this.plans = data);
  }

  enroll(planId: number) {
    if(!confirm("Confirm Enrollment? A new policy will be created.")) return;
    
    this.policyService.enrollPolicy(this.userId, planId).subscribe({
      next: () => {
        alert("Enrollment Successful! Check 'My Policies'.");
        // Optional: Redirect to policies tab logic
      },
      error: () => alert("Enrollment Failed.")
    });
  }
}