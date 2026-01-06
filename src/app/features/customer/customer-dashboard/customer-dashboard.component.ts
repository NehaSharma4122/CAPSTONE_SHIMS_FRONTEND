import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
// Import Child Components
import { CustomerHomeComponent } from '../customer-home/customer-home.component';
import { CustomerPoliciesComponent } from '../customer-policies/customer-policies.component';
import { CustomerPlansComponent } from '../customer-plans/customer-plans.component';
import { CustomerClaimsComponent } from '../customer-claims/customer-claims.component';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    CustomerHomeComponent, 
    CustomerPoliciesComponent, 
    CustomerPlansComponent, 
    CustomerClaimsComponent
  ],
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css']
})
export class CustomerDashboardComponent implements OnInit {
  activeTab: string = 'home';
  userName: string = 'Customer';
  userId: number = 0;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userName = this.authService.getUserName();
    // Assuming you store full user object in localstorage
    const userStr = localStorage.getItem('user');
    if(userStr) this.userId = JSON.parse(userStr).id;
  }

  logout() {
    this.authService.logout();
  }
}