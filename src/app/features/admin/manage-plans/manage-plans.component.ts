import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlanService } from '../../../core/services/plan.service';

@Component({
  selector: 'app-manage-plans',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-plans.component.html',
  styleUrls: ['./manage-plans.component.css']
})
export class ManagePlansComponent implements OnInit {
  
  plans: any[] = []; // All plans from DB
  filteredPlans: any[] = []; // Plans currently displayed (filtered)
  searchTerm: string = '';

  // Modal & Form State
  showModal: boolean = false;
  isEditing: boolean = false;
  
  // Form Model
  currentPlan: any = {
    planName: '',
    description: '',
    premiumAmount: 0,
    coverageLimitType: 'AMOUNT', // Default
    coverageLimitValue: 0
  };

  constructor(private planService: PlanService) {}

  ngOnInit() {
    this.loadPlans();
  }

  loadPlans() {
    this.planService.getAllPlans().subscribe({
      next: (data) => {
        this.plans = data;
        this.filteredPlans = data; // Initially show all
      },
      error: (e) => console.error('Error fetching plans', e)
    });
  }

  // --- SEARCH LOGIC (Client Side) ---
  onSearch() {
    const term = this.searchTerm.toLowerCase();
    this.filteredPlans = this.plans.filter(p => 
      p.planName.toLowerCase().includes(term) || 
      p.id.toString().includes(term)
    );
  }

  // --- MODAL LOGIC ---
  openAddModal() {
    this.isEditing = false;
    // Reset Form
    this.currentPlan = { planName: '', description: '', premiumAmount: 0, coverageLimitType: 'AMOUNT', coverageLimitValue: 0 };
    this.showModal = true;
  }

  openEditModal(plan: any) {
    this.isEditing = true;
    // Clone object to avoid live editing in background
    this.currentPlan = { ...plan }; 
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  // --- CRUD OPERATIONS ---
  savePlan() {
    if (this.isEditing) {
      // UPDATE
      this.planService.updatePlan(this.currentPlan.id, this.currentPlan).subscribe({
        next: () => {
          alert('Plan updated successfully');
          this.loadPlans();
          this.closeModal();
        },
        error: () => alert('Failed to update plan')
      });
    } else {
      // CREATE
      this.planService.createPlan(this.currentPlan).subscribe({
        next: () => {
          alert('Plan created successfully');
          this.loadPlans();
          this.closeModal();
        },
        error: () => alert('Failed to create plan')
      });
    }
  }

  deletePlan(id: number) {
    if(confirm('Are you sure you want to delete this plan? This cannot be undone.')) {
      this.planService.deletePlan(id).subscribe({
        next: () => {
          this.loadPlans(); // Refresh list
        },
        error: () => alert('Failed to delete plan. It might be linked to active policies.')
      });
    }
  }
}