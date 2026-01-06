import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PlanService {
  private planUrl = 'http://localhost:9000/plan-policy-service/api'; // Base URL

  constructor(private http: HttpClient) {}

  // Helper for Auth Headers
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    };
  }

  // 1. Get All Plans
  getAllPlans() {
    // Public endpoint usually, but using headers just in case
    return this.http.get<any[]>(`${this.planUrl}/plans/inventory`);
  }

  // 2. Add Plan
  createPlan(plan: any) {
    return this.http.post(`${this.planUrl}/admin/plans/add`, plan, this.getHeaders());
  }

  // 3. Update Plan
  updatePlan(planId: number, plan: any) {
    return this.http.put(`${this.planUrl}/admin/plans/update/${planId}`, plan, this.getHeaders());
  }

  // 4. Delete Plan
  deletePlan(planId: number) {
    return this.http.delete(`${this.planUrl}/admin/plans/cancel/${planId}`, this.getHeaders());
  }

  getPlanById(planId: number) {
    return this.http.get<any>(`${this.planUrl}/plans/${planId}`, this.getHeaders());
  }
}