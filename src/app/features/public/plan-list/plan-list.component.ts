import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface InsurancePlan {
  id: number;
  planName: string;
  premiumAmount: number;
  coverageLimitType: string;
  coverageLimitValue: number;
}

@Component({
  selector: 'app-plan-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './plan-list.component.html',
  styleUrls: ['./plan-list.component.css']
})
export class PlanListComponent implements OnInit {
  plans: InsurancePlan[] = [];
  loading: boolean = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<InsurancePlan[]>('http://localhost:9000/plan-policy-service/api/plans/inventory')
      .subscribe({
        next: (data) => {
          this.plans = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching plans', err);
          this.loading = false;
        }
      });
  }

  enroll(plan: InsurancePlan) {
    alert(`Starting enrollment for: ${plan.planName}`);
  }
}