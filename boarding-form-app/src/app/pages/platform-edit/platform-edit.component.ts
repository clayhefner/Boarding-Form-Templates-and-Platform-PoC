import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzAlertModule } from 'ng-zorro-antd/alert';

@Component({
  selector: 'app-platform-edit',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzTabsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NzIconModule,
    NzGridModule,
    NzSwitchModule,
    NzInputNumberModule,
    NzDividerModule,
    NzCardModule,
    NzToolTipModule,
    NzTagModule,
    NzAlertModule
  ],
  templateUrl: './platform-edit.component.html',
  styleUrl: './platform-edit.component.css'
})
export class PlatformEditComponent implements OnInit {
  platformForm!: FormGroup;
  platformId: string | null = null;
  isEditMode = false;
  pageTitle = 'Add Platform';
  isSaving = false;
  hasUnsavedChanges = false;
  private initialFormValue: any;

  // Approved Domains management
  approvedDomains: string[] = [];
  newDomain = '';
  editingDomainIndex: number | null = null;
  editingDomainValue = '';

  // MCC Code options
  mccCodeOptions = [
    { code: '1731', label: '1731 - Electrical Contractors' },
    { code: '1740', label: '1740 - Masonry, Stonework, Tile Setting' },
    { code: '5812', label: '5812 - Eating Places and Restaurants' },
    { code: '5814', label: '5814 - Fast Food Restaurants' },
    { code: '7372', label: '7372 - Computer Programming Services' },
    { code: '8011', label: '8011 - Doctors and Physicians' }
  ];

  // Country options
  countryOptions = [
    { value: 'US', label: 'United States' },
    { value: 'CA', label: 'Canada' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'AU', label: 'Australia' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.platformId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.platformId;
    this.pageTitle = this.isEditMode ? 'Edit Platform' : 'Add Platform';

    this.initForm();

    if (this.isEditMode) {
      this.loadPlatform();
    }
  }

  initForm(): void {
    this.platformForm = this.fb.group({
      // Business Info
      name: ['', [Validators.required]],
      businessLegalName: [''],
      address: [''],
      address2: [''],
      country: ['US'],
      city: [''],
      region: [''],
      postal: [''],
      contactName: [''],

      // Platform Settings
      isTestPlatform: [false],
      isDemoPlatform: [false],
      phoneNumber: [''],
      defaultMccCode: [''],
      mccCodes: [[]],
      autoEnrichMerchantRecordsLive: [false],
      autoEnrichMerchantRecordsTest: [false],
      displayEnrichmentDataOnForms: [false],
      estHighTicket: [null],
      estAverageTicket: [null],
      estAnnualSalesVolume: [null],
      productServiceDescription: ['']
    });

    // Store initial form value and track changes
    this.initialFormValue = this.platformForm.value;
    this.platformForm.valueChanges.subscribe(() => {
      this.hasUnsavedChanges = JSON.stringify(this.platformForm.value) !== JSON.stringify(this.initialFormValue);
    });
  }

  loadPlatform(): void {
    // Mock data - replace with actual API call
    setTimeout(() => {
      const mockData = {
        name: 'Stripe Platform',
        businessLegalName: 'Stripe, Inc.',
        address: '510 Townsend Street',
        address2: 'Suite 200',
        country: 'US',
        city: 'San Francisco',
        region: 'CA',
        postal: '94103',
        contactName: 'John Doe',
        isTestPlatform: false,
        isDemoPlatform: true,
        phoneNumber: '(555) 123-4567',
        defaultMccCode: '5812',
        mccCodes: ['5812', '5814'],
        autoEnrichMerchantRecordsLive: true,
        autoEnrichMerchantRecordsTest: false,
        displayEnrichmentDataOnForms: false,
        estHighTicket: 500,
        estAverageTicket: 75,
        estAnnualSalesVolume: 1250000,
        productServiceDescription: 'Payment processing and financial services'
      };

      this.platformForm.patchValue(mockData);
      // Load approved domains
      this.approvedDomains = ['https://example.com', 'https://app.stripe.com', 'localhost:4200'];
      // Reset initial value after loading data
      this.initialFormValue = this.platformForm.value;
      this.hasUnsavedChanges = false;
    }, 500);
  }

  // Approved Domains Management Methods
  addDomain(): void {
    if (!this.newDomain || this.newDomain.trim() === '') {
      this.message.error('Please enter a domain');
      return;
    }

    const trimmedDomain = this.newDomain.trim();

    // Check for duplicates
    if (this.approvedDomains.includes(trimmedDomain)) {
      this.message.warning('This domain already exists in the list');
      return;
    }

    this.approvedDomains.push(trimmedDomain);
    this.newDomain = '';
    this.hasUnsavedChanges = true;
    this.message.success('Domain added successfully');
  }

  editDomain(index: number): void {
    this.editingDomainIndex = index;
    this.editingDomainValue = this.approvedDomains[index];
  }

  saveDomainEdit(index: number): void {
    if (this.editingDomainValue && this.editingDomainValue.trim() !== '') {
      const trimmedDomain = this.editingDomainValue.trim();

      // Check for duplicates (excluding current index)
      const isDuplicate = this.approvedDomains.some((domain, i) =>
        i !== index && domain === trimmedDomain
      );

      if (isDuplicate) {
        this.message.warning('This domain already exists in the list');
        return;
      }

      this.approvedDomains[index] = trimmedDomain;
      this.editingDomainIndex = null;
      this.editingDomainValue = '';
      this.hasUnsavedChanges = true;
      this.message.success('Domain updated successfully');
    }
  }

  cancelDomainEdit(): void {
    this.editingDomainIndex = null;
    this.editingDomainValue = '';
  }

  deleteDomain(index: number): void {
    this.approvedDomains.splice(index, 1);
    this.hasUnsavedChanges = true;
    this.message.success('Domain deleted successfully');
  }

  onSubmit(): void {
    if (this.platformForm.valid) {
      this.isSaving = true;

      // Mock save - replace with actual API call
      setTimeout(() => {
        this.isSaving = false;
        this.message.success(this.isEditMode ? 'Platform updated successfully!' : 'Platform created successfully!');
        this.router.navigate(['/platform']);
      }, 1000);
    } else {
      Object.values(this.platformForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      this.message.error('Please fill in all required fields');
    }
  }

  onCancel(): void {
    this.router.navigate(['/platform']);
  }

  formatCurrency(value: number | null): string {
    if (!value) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }
}
