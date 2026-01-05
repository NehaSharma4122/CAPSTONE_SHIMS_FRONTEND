import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AdminService {
  // User Management Service URL (Port 8083)
  private adminUrl = 'http://localhost:9000/user-management-service/api/admin';

  constructor(private http: HttpClient) {}

  // Helper for Headers
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    };
  }

  getAllUsers() {
    return this.http.get<any[]>(`${this.adminUrl}/users/all`, this.getHeaders());
  }

  // Create different roles
  createAgent(data: any) {
    return this.http.post(`${this.adminUrl}/agent/add`, data, this.getHeaders());
  }

  createClaimOfficer(data: any) {
    return this.http.post(`${this.adminUrl}/claimoff/add`, data, this.getHeaders());
  }

  createHospital(data: any) {
    return this.http.post(`${this.adminUrl}/hospital/add`, data, this.getHeaders());
  }

  deleteUser(userId: number) {
    return this.http.delete(`${this.adminUrl}/users/cancel/${userId}`, this.getHeaders());
  }

  updateUserRole(userId: number, newRole: string) {
    const body = { role: newRole };
    return this.http.put(`${this.adminUrl}/users/role/${userId}`, body, this.getHeaders());
  }
}