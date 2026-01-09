import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authUrl = 'http://localhost:9000/authentication-service/api/auth';

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
 
  constructor(private http: HttpClient, private router: Router) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }
  // 1. Register (Customers Only)
  register(userData: any) {
    return this.http.post(`${this.authUrl}/signup`, userData);
  }

  // 2. Login (All Roles)
  login(credentials: any) {
    return this.http.post<any>(`${this.authUrl}/login`, credentials).pipe(
      tap(response => {
        // Store tokens and user details
        localStorage.setItem('token', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('role', response.role);
        localStorage.setItem('user', JSON.stringify({
            id: response.userId,
            username: response.username,
            email: response.email
        }));
        this.isLoggedInSubject.next(true);
      })
    );
  }

  // 3. Logout
  logout() {
    // Optional: Call API to blacklist token
    localStorage.clear();
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/auth/login']);
  }
  
  changePassword(data: any) {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("No login token found");
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(
      `${this.authUrl}/change-password`, 
      data, 
      { 
        headers: headers,
        responseType: 'text' // <--- CRITICAL FIX: Tells Angular not to parse JSON
      }
    );
  }

  // Helper to get Role
  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getUserName(): string {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr).username : 'User';
  }
  getEmail(): string {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr).email : 'User';
  }
}