import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ClaimService {
  private apiUrl = 'http://localhost:9000/claim-service/api/claims'; 

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    };
  }


  submitClaimByHospital(hospitalId: number, policyId: number, data: any) {
    return this.http.post(`${this.apiUrl}/hospitals/${hospitalId}/${policyId}`, data, this.getHeaders());
  }
  submitClaimByCustomer(userId: number,policyId:number, data:any){
        return this.http.post(`${this.apiUrl}/users/${userId}/${policyId}`, data, this.getHeaders());
  }
  // ================= GET REQUESTS =================

  // VII. Get All
  getAllClaims() {
    return this.http.get<any[]>(`${this.apiUrl}/all`, this.getHeaders());
  }

  // VIII. Get By Claim ID
  getClaimById(id: number) {
    return this.http.get<any>(`${this.apiUrl}/${id}`, this.getHeaders());
  }

  // IX. Get By User ID
  getClaimsByUserId(userId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`, this.getHeaders());
  }

  // X - XIV. Get By Status
  getClaimsByStatus(status: string) {
    // status options: submitted, in_review, approved, paid, rejected
    return this.http.get<any[]>(`${this.apiUrl}/status/${status}/all`, this.getHeaders());
  }

  // ================= PUT (STATUS CHANGE) REQUESTS =================

  // III. Mark Review
  markInReview(id: number) {
    return this.http.put(`${this.apiUrl}/claimoff/status/review/${id}`, {}, this.getHeaders());
  }

  // IV. Mark Approved
  markApproved(id: number) {
    return this.http.put(`${this.apiUrl}/claimoff/status/approved/${id}`, {}, this.getHeaders());
  }

  // V. Mark Paid
  markPaid(id: number) {
    return this.http.put(`${this.apiUrl}/claimoff/status/paid/${id}`, {}, this.getHeaders());
  }

  // VI. Mark Rejected
  markRejected(id: number) {
    return this.http.put(`${this.apiUrl}/claimoff/status/rejected/${id}`, {}, this.getHeaders());
  }
}