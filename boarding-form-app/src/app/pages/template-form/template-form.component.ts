import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzUploadModule, NzUploadFile, NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { AdminModeService } from '../../services/admin-mode.service';
import { Subscription } from 'rxjs';
import { CONNECTION_PRESETS, ConnectionPreset } from './connection-presets';

@Component({
  selector: 'app-template-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzFormModule,
    NzSelectModule,
    NzSwitchModule,
    NzInputNumberModule,
    NzDividerModule,
    NzCardModule,
    NzGridModule,
    NzUploadModule,
    NzBadgeModule,
    NzDrawerModule,
    NzToolTipModule,
    NzRadioModule,
    NzAlertModule,
    NzCollapseModule
  ],
  templateUrl: './template-form.component.html',
  styleUrl: './template-form.component.css'
})
export class TemplateFormComponent implements OnInit, OnDestroy {
  isEditMode = false;
  templateId: string | null = null;
  pageTitle = 'Add Template';
  currentTemplateName = '';
  templateForm!: FormGroup;
  isSaving = false;
  hasUnsavedChanges = false;
  showPreview = false; // Preview hidden by default

  // Drawer for field configuration
  drawerVisible = false;
  drawerTitle = '';
  currentFieldPath: string[] = [];
  currentFieldConfig: any = null;
  currentFieldType: 'basic' | 'withConstraints' | 'withEnum' = 'basic';
  isAdminMode = false;
  private adminModeSubscription?: Subscription;

  // Track expanded subtext sections
  expandedSubtextFields: Set<string> = new Set();

  // Track collapsed custom form field sections (collapsed by default)
  private readonly DEFAULT_COLLAPSED_SECTIONS = ['businessInfo', 'owners', 'banking', 'attachments'] as const;
  collapsedSections: Set<string> = new Set(this.DEFAULT_COLLAPSED_SECTIONS);

  // Domain options
  domainOptions = [
    { value: 'https://boarding.dev.preczn.com', label: 'boarding.dev.preczn.com' },
    { value: 'https://boarding.staging.preczn.com', label: 'boarding.staging.preczn.com' },
    { value: 'https://boarding.preczn.com', label: 'boarding.preczn.com' }
  ];

  // MCC Code options with descriptions
  mccCodeOptions = [
    { code: '1731', label: '1731 - Electrical Contractors' },
    { code: '1740', label: '1740 - Masonry, Stonework, Tile Setting, Plastering, and Insulation Contractors' },
    { code: '1750', label: '1750 - Carpentry Contractors' },
    { code: '5812', label: '5812 - Eating Places and Restaurants' },
    { code: '5814', label: '5814 - Fast Food Restaurants' },
    { code: '7372', label: '7372 - Computer Programming, Data Processing, and Integrated Systems Design Services' },
    { code: '7394', label: '7394 - Equipment, Tool, Furniture and Appliance Rental and Leasing' },
    { code: '8011', label: '8011 - Doctors and Physicians (Not Elsewhere Classified)' },
    { code: '8021', label: '8021 - Dentists and Orthodontists' },
    { code: '8099', label: '8099 - Medical Services and Health Practitioners (Not Elsewhere Classified)' }
  ];

  // Connection presets for Quick Setup
  connectionPresets = CONNECTION_PRESETS;
  selectedPresetId: string | null = null;

  // Logo upload
  uploadedLogoUrl: string = '';
  uploadedLogoFileName: string = '';

  // Logo upload constraints
  private readonly ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
  private readonly MAX_FILE_SIZE_MB = 2;
  private readonly BYTES_PER_MB = 1024 * 1024;

  beforeLogoUpload = (file: NzUploadFile): boolean => {
    // Validate file type
    const isValidType = this.ALLOWED_IMAGE_TYPES.includes(file.type || '');
    if (!isValidType) {
      this.message.error('You can only upload PNG or JPG files!');
      return false;
    }

    // Validate file size
    const fileSizeMB = (file.size || 0) / this.BYTES_PER_MB;
    if (fileSizeMB > this.MAX_FILE_SIZE_MB) {
      this.message.error(`Image must be smaller than ${this.MAX_FILE_SIZE_MB}MB!`);
      return false;
    }

    return true;
  };

  customUploadRequest = (item: any): any => {
    // Handle the file upload manually
    const file = item.file;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const logoUrl = e.target?.result as string;
      this.uploadedLogoUrl = logoUrl;
      this.uploadedLogoFileName = file.name;
      this.templateForm.get('heading.logo')?.setValue(logoUrl);
      this.hasUnsavedChanges = true;
      this.message.success('Logo uploaded successfully!');

      // Call success callback
      item.onSuccess({}, item.file, {});
    };

    reader.onerror = () => {
      this.message.error('Failed to read file!');
      item.onError({}, item.file);
    };

    reader.readAsDataURL(file);
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private message: NzMessageService,
    private adminModeService: AdminModeService
  ) {}

  ngOnInit(): void {
    this.templateId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.templateId;
    this.pageTitle = this.isEditMode ? 'Edit Template' : 'Add Template';

    // Subscribe to admin mode changes
    this.adminModeSubscription = this.adminModeService.isAdminMode$.subscribe(
      isAdmin => {
        this.isAdminMode = isAdmin;
      }
    );

    this.initForm();

    if (this.isEditMode) {
      this.loadTemplateData();
    }

    // Track form changes
    this.templateForm.valueChanges.subscribe(() => {
      this.hasUnsavedChanges = true;
    });
  }

  ngOnDestroy(): void {
    if (this.adminModeSubscription) {
      this.adminModeSubscription.unsubscribe();
    }
  }

  initForm(): void {
    this.templateForm = this.fb.group({
      // Basic Info
      name: ['', Validators.required],
      type: ['KYC', Validators.required],
      domain: ['', Validators.required],
      mccCodes: [[]],

      // Heading Section
      heading: this.fb.group({
        title: ['', Validators.required],
        titleColor: ['#4014be', Validators.required],
        accentColor: ['#4014be', Validators.required],
        logo: ['']
      }),

      // Button Section
      button: this.fb.group({
        textColor: ['#edf0f5', Validators.required],
        accentColor: ['#4014be', Validators.required]
      }),

      // URLs and Settings
      returnUrl: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
      expirationUrl: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
      expirationInHours: [72, Validators.required],
      tosUrl: ['', [Validators.pattern(/^https?:\/\/.+/)]],

      // Display Settings
      displayTos: [true],
      displayNewUserLogin: [true],
      autoTransmitMerchantData: [true],

      // Support Section
      support: this.fb.group({
        email: ['', [Validators.email]],
        phone: ['', [Validators.pattern(/^\+?[\d\s\-\(\)]+$/)]],
        url: ['', [Validators.pattern(/^https?:\/\/.+/)]],
        text: ['']
      }),

      // Custom Form Fields (Admin Only)
      customFormFields: this.fb.group({
        businessInfo: this.fb.group({
          fields: this.fb.group({
            // Note: address and mailingAddress are nested AddressCustom objects - skipping for now as they need complex nested forms
            annualSaleVolume: this.createBasicField(),
            annualFinanceVolume: this.createBasicField(),
            averageTicket: this.createBasicField(),
            highTicket: this.createBasicField(),
            // Note: billingContact is nested BillingContact object - skipping for now
            customerServicePhone: this.createBasicField(),
            dateEstablished: this.createBasicField(),
            email: this.createBasicField(),
            industry: this.createBasicField(),
            legalName: this.createFieldWithConstraints(),
            name: this.createFieldWithConstraints(),
            phone: this.createBasicField(),
            productServiceDescription: this.createBasicField(),
            publicCompany: this.createBasicField(),
            shipToDays: this.createBasicField(),
            stateIncorporated: this.createBasicField(),
            tin: this.createFieldWithConstraints(),
            tinType: this.createFieldWithEnum(),
            businessType: this.createFieldWithEnum(),
            website: this.createBasicField(),
            mcc: this.createBasicField(),
            countryIncorporated: this.createBasicField()
          }),
          attachments: this.fb.group({
            determinationLetter501c3: this.createBasicField(),
            form990: this.createBasicField()
          })
        }),
        owners: this.fb.group({
          fields: this.fb.group({
            firstName: this.createBasicField(),
            lastName: this.createBasicField(),
            middleName: this.createBasicField(),
            // Note: address is nested AddressCustom object - skipping for now
            businessTitle: this.createFieldWithConstraints(),
            type: this.createFieldWithEnum(),
            citizenshipCountry: this.createBasicField(),
            email: this.createBasicField(),
            phone: this.createBasicField(),
            dob: this.createBasicField(),
            ssn: this.createBasicField(),
            ssnLast4: this.createBasicField(),
            ownershipPercent: this.createBasicField(),
            ownershipDate: this.createBasicField(),
            primaryRepresentative: this.createBasicField(),
            significantResponsibility: this.createBasicField(),
            politicallyExposed: this.createBasicField(),
            driversLicenseNumber: this.createFieldWithConstraints(),
            driversLicenseState: this.createBasicField(),
            driversLicenseExpiration: this.createBasicField()
          }),
          attachments: this.fb.group({
            id: this.createBasicField(),
            idFront: this.createBasicField(),
            idBack: this.createBasicField(),
            utilityBill: this.createBasicField()
          })
        }),
        banking: this.fb.group({
          fields: this.fb.group({
            account: this.createBasicField(),
            routing: this.createBasicField(),
            accountType: this.createFieldWithEnum(),
            accountName: this.createBasicField(),
            nameOnAccount: this.createBasicField(),
            country: this.createFieldWithEnum(),
            primaryAccount: this.createBasicField(),
            hasDisbursementHistory: this.createBasicField()
          }),
          attachments: this.fb.group({
            bankStatement: this.createBasicField(),
            voidedCheck: this.createBasicField()
          })
        }),
        attachments: this.fb.group({
          attachments: this.fb.group({
            businessLicense: this.createBasicField(),
            ss4: this.createBasicField(),
            other: this.createBasicField(),
            proofOfEmployment: this.createBasicField(),
            articlesOfIncorporation: this.createBasicField()
          })
        })
      })
    });
  }

  loadTemplateData(): void {
    // This would load data from a service in a real app
    // For now, we'll use sample data
    const sampleData = {
      name: 'Payrix Form',
      type: 'KYC',
      domain: 'https://boarding.dev.preczn.com',
      mccCodes: ['7372', '1731', '1740', '1750'],
      heading: {
        title: 'Payrix Form',
        titleColor: '#4014be',
        accentColor: '#4014be',
        logo: ''
      },
      button: {
        textColor: '#edf0f5',
        accentColor: '#4014be'
      },
      returnUrl: 'www.clayhefner.com',
      expirationUrl: 'www.clayhefner.com/expired',
      expirationInHours: 72,
      tosUrl: '',
      displayTos: true,
      displayNewUserLogin: true,
      autoTransmitMerchantData: true,
      support: {
        email: '',
        phone: '',
        url: '',
        text: ''
      }
    };

    this.templateForm.patchValue(sampleData);
    this.currentTemplateName = sampleData.name;

    // Set logo preview if exists
    if (sampleData.heading.logo) {
      this.uploadedLogoUrl = sampleData.heading.logo;
      this.uploadedLogoFileName = 'existing-logo.png'; // In real app, this would come from the data
    }
  }

  onCancel(): void {
    if (this.hasUnsavedChanges) {
      // Could add confirmation modal here
      this.message.warning('You have unsaved changes');
    }
    this.router.navigate(['/boarding-form-templates']);
  }

  onSave(): void {
    if (this.templateForm.valid) {
      this.isSaving = true;
      console.log('Save template:', this.templateForm.value);

      // Simulate API call
      setTimeout(() => {
        this.isSaving = false;
        this.hasUnsavedChanges = false;
        this.message.success('Template saved successfully!');
        this.router.navigate(['/boarding-form-templates']);
      }, 1000);
    } else {
      this.message.error('Please fill in all required fields');
      this.markFormGroupTouched(this.templateForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  removeLogo(): void {
    this.uploadedLogoUrl = '';
    this.uploadedLogoFileName = '';
    this.templateForm.get('heading.logo')?.setValue('');
    this.hasUnsavedChanges = true;
    this.message.success('Logo removed successfully!');
  }

  togglePreview(): void {
    this.showPreview = !this.showPreview;
  }

  // Preview data getters
  get previewTitle(): string {
    return this.templateForm.get('heading.title')?.value || 'Form Title';
  }

  get previewTitleColor(): string {
    return this.templateForm.get('heading.titleColor')?.value || '#4014be';
  }

  get previewAccentColor(): string {
    return this.templateForm.get('heading.accentColor')?.value || '#4014be';
  }

  get previewButtonTextColor(): string {
    return this.templateForm.get('button.textColor')?.value || '#edf0f5';
  }

  get previewButtonAccentColor(): string {
    return this.templateForm.get('button.accentColor')?.value || '#4014be';
  }

  // Helper methods to create field form groups
  private createBasicField(): FormGroup {
    return this.fb.group({
      display: [false],
      displayAttributes: this.fb.group({
        subText: ['']
      })
    });
  }

  private createFieldWithConstraints(): FormGroup {
    return this.fb.group({
      display: [false],
      displayAttributes: this.fb.group({
        subText: ['']
      }),
      fieldConstraints: this.fb.group({
        allowAlpha: [true],
        allowNumeric: [true],
        allowWhitespace: [true],
        allowedSpecialCharacters: [''],
        minLength: [1],
        maxLength: [255]
      })
    });
  }

  private createFieldWithEnum(): FormGroup {
    return this.fb.group({
      display: [false],
      displayAttributes: this.fb.group({
        subText: ['']
      }),
      enum: [[]]
    });
  }

  // Field configuration drawer methods
  openFieldConfig(fieldPath: string[], fieldName: string, fieldType: 'basic' | 'withConstraints' | 'withEnum' = 'basic'): void {
    this.currentFieldPath = fieldPath;
    this.currentFieldType = fieldType;
    this.drawerTitle = `Configure: ${fieldName}`;

    // Get the field control from the form
    let control = this.templateForm.get(['customFormFields', ...fieldPath]);
    this.currentFieldConfig = control;

    this.drawerVisible = true;
  }

  closeFieldConfig(): void {
    this.drawerVisible = false;
    this.currentFieldPath = [];
    this.currentFieldConfig = null;
  }

  saveFieldConfig(): void {
    // The form is already bound, so changes are automatically saved
    this.hasUnsavedChanges = true;
    this.closeFieldConfig();
    this.message.success('Field configuration saved!');
  }

  // Helper to check if a field is enabled
  isFieldEnabled(fieldPath: string[]): boolean {
    const control = this.templateForm.get(['customFormFields', ...fieldPath, 'display']);
    return control?.value === true;
  }

  // Helper to toggle subtext section
  toggleSubtext(fieldPath: string[]): void {
    const key = fieldPath.join('.');
    if (this.expandedSubtextFields.has(key)) {
      this.expandedSubtextFields.delete(key);
    } else {
      this.expandedSubtextFields.add(key);
    }
  }

  // Helper to check if subtext is expanded
  isSubtextExpanded(fieldPath: string[]): boolean {
    const key = fieldPath.join('.');
    return this.expandedSubtextFields.has(key);
  }

  // Toggle section collapse state
  toggleSection(sectionName: string): void {
    if (this.collapsedSections.has(sectionName)) {
      this.collapsedSections.delete(sectionName);
    } else {
      this.collapsedSections.add(sectionName);
    }
  }

  // Check if section is collapsed
  isSectionCollapsed(sectionName: string): boolean {
    return this.collapsedSections.has(sectionName);
  }

  // Count enabled fields in a section
  getEnabledFieldCount(sectionPath: string[]): string {
    const sectionGroup = this.templateForm.get(sectionPath);
    if (!sectionGroup) {
      return '0/0';
    }

    const { total, enabled } = this.countFields(sectionGroup);
    return `${enabled}/${total}`;
  }

  // Helper method to count fields in a form group
  private countFields(sectionGroup: any): { total: number; enabled: number } {
    let total = 0;
    let enabled = 0;

    const fieldsGroup = sectionGroup.get('fields');
    const attachmentsGroup = sectionGroup.get('attachments');

    // Count fields
    if (fieldsGroup) {
      const { total: fieldTotal, enabled: fieldEnabled } = this.countControlsInGroup(fieldsGroup);
      total += fieldTotal;
      enabled += fieldEnabled;
    }

    // Count attachments
    if (attachmentsGroup) {
      const { total: attachmentTotal, enabled: attachmentEnabled } = this.countControlsInGroup(attachmentsGroup);
      total += attachmentTotal;
      enabled += attachmentEnabled;
    }

    return { total, enabled };
  }

  // Helper method to count controls in a form group
  private countControlsInGroup(group: any): { total: number; enabled: number } {
    const controlKeys = Object.keys(group.controls || {});
    const total = controlKeys.length;
    const enabled = controlKeys.filter(key => {
      const control = group.get(key);
      return control?.get('display')?.value === true;
    }).length;

    return { total, enabled };
  }

  // Quick Setup preset methods
  selectPreset(presetId: string): void {
    this.selectedPresetId = presetId;
    this.hasUnsavedChanges = true;
  }

  getSelectedPresetName(): string {
    const preset = this.connectionPresets.find(p => p.id === this.selectedPresetId);
    return preset?.name || '';
  }

  applyPreset(): void {
    const preset = this.connectionPresets.find(p => p.id === this.selectedPresetId);

    if (!preset || preset.id === 'custom') {
      return;
    }

    // Apply preset configuration to custom form fields
    const customFormFields = this.templateForm.get('customFormFields');

    if (!customFormFields) {
      this.message.error('Custom form fields not initialized');
      return;
    }

    // Apply Business Info fields
    if (preset.fields.businessInfo) {
      this.applyFieldPresets(
        customFormFields.get('businessInfo.fields'),
        preset.fields.businessInfo.fields || {}
      );
      this.applyFieldPresets(
        customFormFields.get('businessInfo.attachments'),
        preset.fields.businessInfo.attachments || {}
      );
    }

    // Apply Owner fields
    if (preset.fields.owners) {
      this.applyFieldPresets(
        customFormFields.get('owners.fields'),
        preset.fields.owners.fields || {}
      );
      this.applyFieldPresets(
        customFormFields.get('owners.attachments'),
        preset.fields.owners.attachments || {}
      );
    }

    // Apply Banking fields
    if (preset.fields.banking) {
      this.applyFieldPresets(
        customFormFields.get('banking.fields'),
        preset.fields.banking.fields || {}
      );
    }

    // Apply Attachments fields
    if (preset.fields.attachments) {
      this.applyFieldPresets(
        customFormFields.get('attachments.fields'),
        preset.fields.attachments.fields || {}
      );
    }

    this.hasUnsavedChanges = true;
    this.message.success(`${preset.name} configuration applied successfully! Review and customize fields as needed.`);

    // Scroll to custom form fields section
    setTimeout(() => {
      const element = document.querySelector('.admin-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  private applyFieldPresets(formGroup: any, presets: { [key: string]: any }): void {
    if (!formGroup) {
      return;
    }

    Object.keys(presets).forEach(fieldKey => {
      const fieldControl = formGroup.get(fieldKey);
      const preset = presets[fieldKey];

      if (fieldControl) {
        // Set display value
        const displayControl = fieldControl.get('display');
        if (displayControl) {
          displayControl.setValue(preset.display);
        }

        // Set subtext if provided
        if (preset.subText) {
          const displayAttributesGroup = fieldControl.get('displayAttributes');
          if (displayAttributesGroup) {
            const subTextControl = displayAttributesGroup.get('subText');
            if (subTextControl) {
              subTextControl.setValue(preset.subText);
            }
          }
        }
      }
    });
  }
}
