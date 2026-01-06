import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanService } from '../../../core/services/plan.service';

@Component({
  selector: 'app-hospital-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hospital-profile.component.html',
  styleUrls: ['./hospital-profile.component.css']
})
export class HospitalProfileComponent implements OnChanges {
  
  @Input() profile: any = null;
  @Input() links: any[] = []; // This contains { planId: 3, ... }
  @Output() unlinkRequest = new EventEmitter<number>(); // To notify parent

  // We will store the FULL plan details here
  detailedPlans: any[] = [];
  isLoadingPlans: boolean = false;

  constructor(private planService: PlanService, private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges) {
    // Whenever 'links' input changes (e.g., after linking/unlinking), fetch details again
    if (changes['links'] && this.links) {
      this.fetchAllPlanDetails();
      this.cdr.detectChanges();
    }
  }

  fetchAllPlanDetails() {
    this.detailedPlans = [];
    this.isLoadingPlans = true;
    this.cdr.detectChanges()

    if (this.links.length === 0) {
      this.isLoadingPlans = false;
      return;
    }

    // Loop through links and fetch full details for each
    let completed = 0;
    this.links.forEach(link => {
      this.planService.getPlanById(link.planId).subscribe({
        next: (planData) => {
          this.detailedPlans.push(planData);
          completed++;
          if (completed === this.links.length) this.isLoadingPlans = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(`Failed to load plan ${link.planId}`, err);
          completed++;
          if (completed === this.links.length) this.isLoadingPlans = false;
        }
      });
    });
  }

  requestUnlink(planId: number) {
    this.unlinkRequest.emit(planId);
    this.cdr.detectChanges();
  }
}