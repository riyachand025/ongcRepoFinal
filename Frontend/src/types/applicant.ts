export interface Applicant {
  _id?: string;
  submissionTimestamp?: Date;
  email: string;
  instructionAcknowledged: string;
  trainingAcknowledgement: string;
  name: string;
  age: number;
  gender: string;
  category: string;
  address: string;
  mobileNo: string;
  email2: string;
  fatherMotherName: string;
  fatherMotherOccupation: string;
  presentInstitute: string;
  areasOfTraining: string;
  presentSemester: string;
  lastSemesterSGPA: number;
  percentageIn10Plus2: number;
  declaration01: string;
  declaration02: string;
  declaration03: string;
  designation: string;
  cpf: string;
  section: string;
  location: string;
  mentorMobileNo: string;
  mentorDetailsAvailable: string;
  guardianOccupationDetails: string;
  mentorCPF: string;
  mentorName: string;
  mentorDesignation: string;
  mentorSection: string;
  mentorLocation: string;
  mentorEmail: string;
  preferenceCriteria: string;
  referredBy: string;
  status: string;
  
  // Computed fields
  term: 'Summer' | 'Winter';
  quotaCategory: 'General' | 'Reserved';
  lateApplication: boolean;
  uploadDate: Date;
  processedBy: string;
  
  // Approval fields
  autoApproved?: boolean;
  manuallyApproved?: boolean;
  approvalReason?: string;
}

export interface UploadProgress {
  total: number;
  processed: number;
  errors: string[];
  warnings: string[];
}

export interface FilterOptions {
  term?: string;
  category?: string;
  mentorAssigned?: string;
  status?: string;
  quotaCategory?: string;
  lateApplication?: boolean;
}