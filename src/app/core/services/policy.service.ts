import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PolicyService {
  private apiUrl = 'http://localhost:9000/plan-policy-service/api';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    };
  }

  // ==========================================
  // 1. ADMIN SPECIFIC ENDPOINTS (For Component)
  // ==========================================

  // XI. Get All Policies
  getAllPolicies() {
    return this.http.get<any[]>(`${this.apiUrl}/admin/policy/all`, this.getHeaders());
  }

  // XI. Get Policy Details (Single)
  getPolicyById(policyId: number) {
    return this.http.get<any>(`${this.apiUrl}/admin/policy/details/${policyId}`, this.getHeaders());
  }

  // IX. Delete Policy
  deletePolicy(policyId: number) {
    // Response is a string in the controller
    return this.http.delete(`${this.apiUrl}/admin/policy/${policyId}`, { 
      headers: this.getHeaders().headers, 
      responseType: 'text' 
    });
  }

  // VII. Get Policies by User ID (Admin can use this to filter)
  getPoliciesByUserId(userId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/policy/inventory/users/${userId}`, this.getHeaders());
  }

  // ==========================================
  // 2. OTHER ENDPOINTS (Implemented but not used in Admin Dashboard)
  // ==========================================

  // I. Enroll
  enrollPolicy(userId: number, planId: number) {
    return this.http.post(`${this.apiUrl}/policy/enroll/${userId}/${planId}`, {}, this.getHeaders());
  }

  // III. Renew
  renewPolicy(userId: number, policyId: number, remarks: string = '') {
    // Note: Controller snippet provided didn't show @RequestBody, but prompt did. 
    // Sending body just in case, though path variables are primary.
    return this.http.put(`${this.apiUrl}/policy/users/renew/${userId}/${policyId}`, { remarks }, this.getHeaders());
  }

  // X. Suspend / Status Update
  suspendPolicy(userId: number, policyId: number) {
    return this.http.put(`${this.apiUrl}/policy/users/status/${userId}/${policyId}`, {}, this.getHeaders());
  }

  // Get Single User Policy (Customer/Agent view)
  getUserPolicySpecific(userId: number, policyId: number) {
    return this.http.get(`${this.apiUrl}/policy/users/${userId}/${policyId}`, this.getHeaders());
  }
}