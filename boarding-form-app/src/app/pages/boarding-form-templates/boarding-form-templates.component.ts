import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

interface BoardingFormTemplate {
  id: string;
  name: string;
  createdBy: string;
  createdOn: Date;
}

@Component({
  selector: 'app-boarding-form-templates',
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzDropDownModule,
    NzPopconfirmModule
  ],
  templateUrl: './boarding-form-templates.component.html',
  styleUrl: './boarding-form-templates.component.css'
})
export class BoardingFormTemplatesComponent {
  templates: BoardingFormTemplate[] = [
    {
      id: 'TPL-001',
      name: 'Standard Employee Onboarding',
      createdBy: 'John Doe',
      createdOn: new Date('2024-01-15')
    },
    {
      id: 'TPL-002',
      name: 'Contractor Onboarding',
      createdBy: 'Jane Smith',
      createdOn: new Date('2024-02-20')
    },
    {
      id: 'TPL-003',
      name: 'Remote Worker Setup',
      createdBy: 'Bob Johnson',
      createdOn: new Date('2024-03-10')
    }
  ];

  constructor(private router: Router) {}

  editTemplate(template: BoardingFormTemplate): void {
    this.router.navigate(['/template/edit', template.id]);
  }

  deleteTemplate(template: BoardingFormTemplate): void {
    this.templates = this.templates.filter(item => item.id !== template.id);
    console.log('Deleted template:', template);
  }

  addTemplate(): void {
    this.router.navigate(['/template/add']);
  }
}
