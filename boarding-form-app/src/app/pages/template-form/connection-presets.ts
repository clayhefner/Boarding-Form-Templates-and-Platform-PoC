export interface FieldPreset {
  display: boolean;
  subText?: string;
}

export interface ConnectionPreset {
  id: string;
  name: string;
  description: string;
  icon?: string;
  fields: {
    businessInfo?: {
      fields?: { [key: string]: FieldPreset };
      attachments?: { [key: string]: FieldPreset };
    };
    owners?: {
      fields?: { [key: string]: FieldPreset };
      attachments?: { [key: string]: FieldPreset };
    };
    banking?: {
      fields?: { [key: string]: FieldPreset };
    };
    attachments?: {
      fields?: { [key: string]: FieldPreset };
    };
  };
}

export const CONNECTION_PRESETS: ConnectionPreset[] = [
  {
    id: 'stripe_connect',
    name: 'Stripe Connect',
    description: 'Standard fields required for Stripe Connect onboarding',
    fields: {
      businessInfo: {
        fields: {
          name: {
            display: true,
            subText: 'Legal business name as registered with government agencies'
          },
          legalName: {
            display: true,
            subText: 'DBA or trade name if different from legal name'
          },
          phone: {
            display: true,
            subText: 'Primary business phone number for verification'
          },
          website: {
            display: true,
            subText: 'Company website URL (used for business verification)'
          },
          tin: {
            display: true,
            subText: 'EIN or SSN for tax reporting (encrypted and secure)'
          },
          tinType: {
            display: true,
            subText: 'Select EIN for businesses or SSN for sole proprietors'
          },
          businessType: {
            display: true,
            subText: 'Legal structure of your business'
          },
          industry: {
            display: true
          },
          mcc: {
            display: true,
            subText: 'Merchant Category Code - describes your business type'
          },
          dateEstablished: {
            display: true
          }
        }
      },
      owners: {
        fields: {
          firstName: {
            display: true,
            subText: 'Legal first name as shown on government-issued ID'
          },
          lastName: {
            display: true,
            subText: 'Legal last name as shown on government-issued ID'
          },
          businessTitle: {
            display: true,
            subText: 'Your role in the company (e.g., Owner, CEO, Partner)'
          },
          ssn: {
            display: true,
            subText: 'Required for identity verification (encrypted and secure)'
          },
          dateOfBirth: {
            display: true,
            subText: 'Must be 18 years or older'
          },
          email: {
            display: true,
            subText: 'Primary email for account notifications'
          },
          phone: {
            display: true
          },
          homeAddressLine1: {
            display: true,
            subText: 'Personal residential address (not PO Box)'
          },
          homeAddressLine2: {
            display: true
          },
          homeCity: {
            display: true
          },
          homeState: {
            display: true
          },
          homePostalCode: {
            display: true
          },
          homeCountry: {
            display: true
          },
          driversLicenseNumber: {
            display: true,
            subText: 'Used for identity verification'
          },
          driversLicenseState: {
            display: true
          },
          driversLicenseExpiration: {
            display: true
          }
        }
      },
      banking: {
        fields: {
          accountHolderName: {
            display: true,
            subText: 'Name on the bank account (must match business name)'
          },
          bankAccountType: {
            display: true
          },
          routingNumber: {
            display: true,
            subText: '9-digit ABA routing number'
          },
          accountNumber: {
            display: true,
            subText: 'Bank account number for deposits'
          }
        }
      }
    }
  },
  {
    id: 'payrix',
    name: 'Payrix',
    description: 'Required fields for Payrix merchant onboarding',
    fields: {
      businessInfo: {
        fields: {
          name: {
            display: true,
            subText: 'Registered business name'
          },
          legalName: {
            display: true
          },
          phone: {
            display: true,
            subText: 'Business contact number'
          },
          website: {
            display: true,
            subText: 'Business website or social media page'
          },
          tin: {
            display: true,
            subText: 'Federal Tax ID (EIN) or SSN'
          },
          tinType: {
            display: true
          },
          businessType: {
            display: true
          },
          industry: {
            display: true
          },
          mcc: {
            display: true,
            subText: 'Industry classification code'
          },
          dateEstablished: {
            display: true,
            subText: 'When the business was founded'
          },
          customerServicePhone: {
            display: true,
            subText: 'Customer support phone for chargebacks and inquiries'
          }
        },
        attachments: {
          determinationLetter501c3: {
            display: false
          },
          form990: {
            display: false
          }
        }
      },
      owners: {
        fields: {
          firstName: {
            display: true
          },
          middleName: {
            display: false
          },
          lastName: {
            display: true
          },
          businessTitle: {
            display: true,
            subText: 'Officer title (Owner, CEO, President, etc.)'
          },
          ssn: {
            display: true,
            subText: 'Social Security Number for KYC verification'
          },
          dateOfBirth: {
            display: true
          },
          email: {
            display: true
          },
          phone: {
            display: true
          },
          homeAddressLine1: {
            display: true
          },
          homeAddressLine2: {
            display: false
          },
          homeCity: {
            display: true
          },
          homeState: {
            display: true
          },
          homePostalCode: {
            display: true
          },
          homeCountry: {
            display: true
          },
          driversLicenseNumber: {
            display: true
          },
          driversLicenseState: {
            display: true
          },
          driversLicenseExpiration: {
            display: false
          }
        }
      },
      banking: {
        fields: {
          accountHolderName: {
            display: true
          },
          bankAccountType: {
            display: true
          },
          routingNumber: {
            display: true
          },
          accountNumber: {
            display: true
          }
        }
      }
    }
  },
  {
    id: 'rainforest',
    name: 'Rainforest',
    description: 'Rainforest payment processing requirements',
    fields: {
      businessInfo: {
        fields: {
          name: {
            display: true,
            subText: 'Business name as it appears on documents'
          },
          legalName: {
            display: true
          },
          phone: {
            display: true
          },
          website: {
            display: true
          },
          tin: {
            display: true
          },
          tinType: {
            display: true
          },
          businessType: {
            display: true,
            subText: 'Corporate structure (LLC, Corp, etc.)'
          },
          industry: {
            display: true
          },
          mcc: {
            display: true
          },
          dateEstablished: {
            display: false
          },
          customerServicePhone: {
            display: true,
            subText: 'Phone number displayed on customer statements'
          }
        }
      },
      owners: {
        fields: {
          firstName: {
            display: true
          },
          middleName: {
            display: false
          },
          lastName: {
            display: true
          },
          businessTitle: {
            display: true
          },
          ssn: {
            display: true
          },
          dateOfBirth: {
            display: true,
            subText: 'Owner must be at least 18 years old'
          },
          email: {
            display: true,
            subText: 'Email for compliance notifications'
          },
          phone: {
            display: true
          },
          homeAddressLine1: {
            display: true
          },
          homeAddressLine2: {
            display: false
          },
          homeCity: {
            display: true
          },
          homeState: {
            display: true
          },
          homePostalCode: {
            display: true
          },
          homeCountry: {
            display: true
          },
          driversLicenseNumber: {
            display: false
          },
          driversLicenseState: {
            display: false
          },
          driversLicenseExpiration: {
            display: false
          },
          passportNumber: {
            display: true,
            subText: 'Required for international business owners'
          },
          passportCountry: {
            display: true
          },
          passportExpiration: {
            display: true
          }
        },
        attachments: {
          id: {
            display: true,
            subText: 'Government-issued ID (Driver\'s License or Passport)'
          }
        }
      },
      banking: {
        fields: {
          accountHolderName: {
            display: true,
            subText: 'Must match business or owner name'
          },
          bankAccountType: {
            display: true
          },
          routingNumber: {
            display: true
          },
          accountNumber: {
            display: true
          },
          bankName: {
            display: true,
            subText: 'Financial institution name'
          }
        }
      }
    }
  },
  {
    id: 'adyen',
    name: 'Adyen',
    description: 'Adyen merchant account setup requirements',
    fields: {
      businessInfo: {
        fields: {
          name: {
            display: true,
            subText: 'Registered company name'
          },
          legalName: {
            display: true,
            subText: 'Legal entity name (if different from trading name)'
          },
          phone: {
            display: true
          },
          website: {
            display: true,
            subText: 'Must be operational and match business description'
          },
          tin: {
            display: true,
            subText: 'Tax identification number (format varies by country)'
          },
          tinType: {
            display: true
          },
          businessType: {
            display: true
          },
          industry: {
            display: true,
            subText: 'Primary business activity'
          },
          mcc: {
            display: true,
            subText: 'Select the MCC that best describes your business'
          },
          dateEstablished: {
            display: true,
            subText: 'Company registration date'
          },
          customerServicePhone: {
            display: true
          }
        },
        attachments: {
          determinationLetter501c3: {
            display: false
          },
          form990: {
            display: false
          }
        }
      },
      owners: {
        fields: {
          firstName: {
            display: true
          },
          middleName: {
            display: true,
            subText: 'Required for enhanced verification'
          },
          lastName: {
            display: true
          },
          businessTitle: {
            display: true,
            subText: 'Must be an authorized signatory'
          },
          ssn: {
            display: true
          },
          dateOfBirth: {
            display: true
          },
          email: {
            display: true
          },
          phone: {
            display: true,
            subText: 'Direct contact number'
          },
          homeAddressLine1: {
            display: true
          },
          homeAddressLine2: {
            display: true
          },
          homeCity: {
            display: true
          },
          homeState: {
            display: true
          },
          homePostalCode: {
            display: true
          },
          homeCountry: {
            display: true
          },
          driversLicenseNumber: {
            display: true
          },
          driversLicenseState: {
            display: true
          },
          driversLicenseExpiration: {
            display: true
          },
          passportNumber: {
            display: true,
            subText: 'Alternative ID if no driver\'s license'
          },
          passportCountry: {
            display: true
          },
          passportExpiration: {
            display: true
          }
        },
        attachments: {
          id: {
            display: true,
            subText: 'Clear color copy of government-issued photo ID'
          }
        }
      },
      banking: {
        fields: {
          accountHolderName: {
            display: true
          },
          bankAccountType: {
            display: true
          },
          routingNumber: {
            display: true,
            subText: 'Bank routing number (US) or SWIFT code (International)'
          },
          accountNumber: {
            display: true,
            subText: 'IBAN or local account number'
          },
          bankName: {
            display: true
          }
        }
      },
      attachments: {
        fields: {
          businessLicense: {
            display: true,
            subText: 'Current business license or registration certificate'
          },
          bankStatement: {
            display: true,
            subText: 'Recent bank statement (within last 3 months)'
          },
          processingStatements: {
            display: true,
            subText: 'Prior processing statements if switching from another processor'
          }
        }
      }
    }
  },
  {
    id: 'custom',
    name: 'Custom Configuration',
    description: 'Start with a blank slate - configure fields manually',
    fields: {}
  }
];
