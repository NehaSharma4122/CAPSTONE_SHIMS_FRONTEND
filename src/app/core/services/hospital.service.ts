import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class HospitalService {
  private apiUrl = 'http://localhost:9000/hospital-service/api/hospitals';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    };
  }

  // I. Onboarding
  onboardHospital(data: any) {
    return this.http.post(`${this.apiUrl}/onboarding`, data, this.getHeaders());
  }

  // II. Get Profile (Used to check onboarding status & get ID)
  getProfile() {
    return this.http.get<any>(`${this.apiUrl}/profile/me`, this.getHeaders());
  }

  // III. Get Hospital Claims Stats
  getHospitalClaims(hospitalId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/claims/${hospitalId}`, this.getHeaders());
  }

  // IV. Link Plan
  linkPlan(hospitalId: number, planId: number) {
    return this.http.post(`${this.apiUrl}/${hospitalId}/plans/${planId}/link`, {}, { 
      headers: this.getHeaders().headers, 
      responseType: 'text' 
    });
  }

  // V. Unlink Plan
  unlinkPlan(hospitalId: number, planId: number) {
    return this.http.delete(`${this.apiUrl}/${hospitalId}/plans/${planId}/unlink`, { 
      headers: this.getHeaders().headers, 
      responseType: 'text' 
    });
  }

  // VI. Get Linked Plans
  getLinkedPlans(hospitalId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/${hospitalId}/plans`, this.getHeaders());
  }
}