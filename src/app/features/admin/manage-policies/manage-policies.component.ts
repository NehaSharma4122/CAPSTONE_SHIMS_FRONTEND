import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PolicyService } from '../../../core/services/policy.service';

@Component({
  selector: 'app-manage-policies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-policies.component.html',
  styleUrls: ['./manage-policies.component.css']
})
export class ManagePoliciesComponent implements OnInit {

  policies: any[] = [];
  searchUserId: string = '';
  
  // Modal State
  showDetailsModal: boolean = false;
  selectedPolicy: any = null;

  constructor(private policyService: PolicyService) {}

  ngOnInit() {
    this.loadAllPolicies();
  }

  loadAllPolicies() {
    this.policyService.getAllPolicies().subscribe({
      next: (data) => this.policies = data,
      error: (e) => console.error('Error fetching policies', e)
    });
  }

  searchByUser() {
    if (!this.searchUserId) {
      this.loadAllPolicies();
      return;
    }
    const uId = Number(this.searchUserId);
    this.policyService.getPoliciesByUserId(uId).subscribe({
      next: (data) => this.policies = data,
      error: () => {
        this.policies = []; // Clear table if no result
        alert('No policies found for this User ID');
      }
    });
  }

  deletePolicy(id: number) {
    if(confirm(`Are you sure you want to delete Policy #${id}?`)) {
      this.policyService.deletePolicy(id).subscribe({
        next: (msg) => {
          // Some backends return text, some JSON. Angular handles based on 'responseType' in Service
          alert(msg || 'Policy Deleted'); 
          this.loadAllPolicies(); 
        },
        error: (err) => alert('Failed to delete policy')
      });
    }
  }

  viewDetails(id: number) {
    // API Call to get fresh details
    this.policyService.getPolicyById(id).subscribe({
      next: (data) => {
        this.selectedPolicy = data;
        this.showDetailsModal = true;
      },
      error: () => alert('Could not fetch details')
    });
  }

  closeModal() {
    this.showDetailsModal = false;
    this.selectedPolicy = null;
  }
  
  // Update status check to match JSON "policyStatus"
  getStatusClass(status: string): string {
    if (!status) return 'badge-secondary';
    switch(status.toUpperCase()) {
      case 'ACTIVE': return 'badge-success';
      case 'EXPIRED': return 'badge-warning';
      case 'SUSPENDED': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }
}