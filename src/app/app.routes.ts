import { Routes } from '@angular/router';
import { LandingComponent } from './features/public/landing/landing.component';
import { PlanListComponent } from './features/public/plan-list/plan-list.component';
import { PolicyRulesComponent } from './features/public/policy-rules/policy-rules.component';
import { IndividualsComponent } from './features/public/individuals/individuals.component';
import { ProvidersComponent } from './features/public/providers/providers.component';
import { EmployeesComponent } from './features/public/employees/employees.component';
import { ContactComponent } from './features/public/contact/contact.component';
import { LoginComponent } from './features/authentication/login/login.component';
import { RegisterComponent } from './features/authentication/register/register.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard';
import { AgentDashboardComponent } from './features/agent/agent-dashboard/agent-dashboard.component';
import { EnrollPolicyComponent } from './features/agent/enroll-policy/enroll-policy.component';
import { ClaimOfficerDashboardComponent } from './features/claim-officer/claim-dashboard.component';
import { HospitalDashboardComponent } from './features/hospital/hospital-dashboard/hospital-dashboard.component';
import { CustomerDashboardComponent } from './features/customer/customer-dashboard/customer-dashboard.component';


export const routes: Routes = [
  { 
    path: '', 
    component: LandingComponent, 
    title: 'InsurePlus - Home' 
  },

  // 2. Product Pages
  { 
    path: 'products/plans', 
    component: PlanListComponent, 
    title: 'Browse Insurance Plans' 
  },
  { 
    path: 'products/rules', 
    component: PolicyRulesComponent, 
    title: 'Policy Rules & Info' 
  },

  // 3. Info Pages (Reusing Landing Component for now, or create specific components)
  { 
    path: 'public/individuals', 
    component: LandingComponent, 
    title: 'For Individuals' 
  },
  { 
    path: 'public/providers', 
    component: LandingComponent, 
    title: 'For Healthcare Providers' 
  },
  { 
    path: 'public/employees', 
    component: LandingComponent, 
    title: 'For Employees' 
  },

  // 4. Authentication (Placeholders based on your requirements)
  { 
    path: 'auth/login', 
    component: LoginComponent, 
    title: 'Login' 
  },
  { 
    path: 'auth/register', 
    component: RegisterComponent, 
    title: 'Register' 
  },

  // 5. Contact Page (Placeholder)
  {
    path: 'contact',
    component:ContactComponent,
    title: 'Contact Us'
  },
  { path: 'admin/dashboard', component: AdminDashboardComponent, title: 'Admin Dashboard' },
  { path: 'info/individuals', component: IndividualsComponent, title: 'For Individuals' },
  { path: 'info/providers', component: ProvidersComponent, title: 'For Providers' },
  { path: 'info/employees', component: EmployeesComponent, title: 'For Employees' },
  { path: 'agent/dashboard', component: AgentDashboardComponent, title: 'Agent Dashboard' }, 
  { path: 'agent/enroll/:id', component: EnrollPolicyComponent, title: 'Enroll Policy' }, 
  { path: 'claimoff/dashboard', component: ClaimOfficerDashboardComponent, title: 'Claims Dashboard' },
  { path: 'hospital/dashboard', component: HospitalDashboardComponent, title: 'Hospital Dashboard' },
  { path: 'customer/dashboard', component: CustomerDashboardComponent, title: 'Customer Dashboard' },

  { 
    path: '**', 
    redirectTo: '' 
  }
];