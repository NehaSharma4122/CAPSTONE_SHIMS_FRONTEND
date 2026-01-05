import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-providers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.css']
})
export class ProvidersComponent {
  // Mocking the inventory data for display
  hospitals = [
    { name: 'City General Hospital', location: 'New York, NY' },
    { name: 'Sunrise Cardiac Centre', location: 'Austin, TX' },
    { name: 'Hope Valley Medical', location: 'Denver, CO' },
    { name: 'Apollo Speciality', location: 'Chennai, IN' },
    { name: 'Cleveland Clinic', location: 'Cleveland, OH' },
    { name: 'Mayo Clinic', location: 'Rochester, MN' }
  ];
}