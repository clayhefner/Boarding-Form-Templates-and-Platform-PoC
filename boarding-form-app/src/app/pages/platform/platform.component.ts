import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { Router } from '@angular/router';

interface Platform {
  id: string;
  name: string;
  volume: number;
  transactions: number;
  rejects: number;
  connections: number;
  isDemo: boolean;
}

@Component({
  selector: 'app-platform',
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzTagModule
  ],
  templateUrl: './platform.component.html',
  styleUrl: './platform.component.css'
})
export class PlatformComponent implements OnInit {
  platforms: Platform[] = [];
  isLoading = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadPlatforms();
  }

  loadPlatforms(): void {
    this.isLoading = true;
    // Mock data - replace with actual API call
    setTimeout(() => {
      this.platforms = [
        {
          id: 'PLT-001',
          name: 'Stripe Platform',
          volume: 1250000,
          transactions: 3450,
          rejects: 45,
          connections: 125,
          isDemo: false
        },
        {
          id: 'PLT-002',
          name: 'Payrix Platform',
          volume: 875000,
          transactions: 2100,
          rejects: 32,
          connections: 89,
          isDemo: false
        },
        {
          id: 'PLT-003',
          name: 'Demo Platform',
          volume: 50000,
          transactions: 150,
          rejects: 5,
          connections: 12,
          isDemo: true
        },
        {
          id: 'PLT-004',
          name: 'Adyen Platform',
          volume: 2100000,
          transactions: 5670,
          rejects: 78,
          connections: 234,
          isDemo: false
        },
        {
          id: 'PLT-005',
          name: 'Rainforest Platform',
          volume: 650000,
          transactions: 1890,
          rejects: 23,
          connections: 67,
          isDemo: false
        }
      ];
      this.isLoading = false;
    }, 500);
  }

  editPlatform(platform: Platform): void {
    this.router.navigate(['/platform/edit', platform.id]);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }
}
