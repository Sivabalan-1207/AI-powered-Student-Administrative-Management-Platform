import type {
  UserProfile,
  ServiceDefinition,
  ApplicationRequest,
  ParentVerificationRecord,
  AcademicRecord,
  AcademicThreshold,
  AcademicAlert,
  FoodProduct,
  StationeryProduct,
  CampusOrder,
  AuditEvent,
  AppNotification
} from '../types';

export const DEMO_USERS: UserProfile[] = [
  {
    id: 'usr-student-1',
    name: 'Alex Morgan',
    email: 'alex.morgan@campus.edu',
    registerNumber: '2023CSE1042',
    role: 'student',
    department: 'Computer Science & Engineering',
    yearOfStudy: 3,
    phone: '+91 98765 43210',
    parentEmail: 'parent.morgan@gmail.com',
    parentPhone: '+91 98765 00001',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-staff-1',
    name: 'Prof. Sarah Jenkins',
    email: 'sarah.jenkins@campus.edu',
    employeeId: 'EMP-ADM-088',
    role: 'staff',
    department: 'Administrative Services',
    phone: '+91 98765 43211',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-hod-1',
    name: 'Dr. Robert Vance',
    email: 'hod.cse@campus.edu',
    employeeId: 'EMP-HOD-012',
    role: 'hod',
    department: 'Computer Science & Engineering',
    phone: '+91 98765 43212',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-admin-1',
    name: 'Dr. Elena Rostova',
    email: 'admin.director@campus.edu',
    employeeId: 'EMP-SYS-001',
    role: 'admin',
    department: 'Institutional Administration',
    phone: '+91 98765 43213',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-food-1',
    name: 'Chef Mario Rossi',
    email: 'foodcourt.manager@campus.edu',
    employeeId: 'EMP-FDC-204',
    role: 'food_staff',
    department: 'Campus Dining Services',
    phone: '+91 98765 43214',
    avatarUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-stationery-1',
    name: 'Alex Bookmaster',
    email: 'stationery.store@campus.edu',
    employeeId: 'EMP-STN-301',
    role: 'stationery_staff',
    department: 'Campus Stationery Hub',
    phone: '+91 98765 43215',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  }
];

export const SERVICES_CATALOG: ServiceDefinition[] = [
  {
    id: 'srv-bonafide',
    title: 'Bonafide Certificate',
    code: 'BON-01',
    category: 'certificate',
    description: 'Official document certifying student enrollment, department, and academic standing.',
    eligibility: 'All currently registered full-time students with no fee dues.',
    requiredFields: [
      { name: 'purpose', label: 'Purpose of Certificate', type: 'select', options: ['Passport Application', 'Bank Loan', 'Bus Pass / Metro Pass', 'Visa Application', 'Internship / External Project', 'Other'], required: true },
      { name: 'neededByDate', label: 'Date Needed By', type: 'date', required: true },
      { name: 'additionalNotes', label: 'Additional Remarks', type: 'textarea', required: false }
    ],
    requiredDocuments: [
      { id: 'doc-id-proof', name: 'Student College ID Card', description: 'Scanned front & back of active student ID.', allowedTypes: ['.pdf', '.jpg', '.png'], maxSizeMB: 5, required: true },
      { id: 'doc-fee-receipt', name: 'Latest Semester Fee Receipt', description: 'Paid fee receipt copy for verification.', allowedTypes: ['.pdf', '.jpg', '.png'], maxSizeMB: 5, required: true }
    ],
    targetDays: 2,
    requiresParentVerification: true,
    requiresHODApproval: true,
    department: 'Academic Registry'
  },
  {
    id: 'srv-study',
    title: 'Study / Medium of Instruction Certificate',
    code: 'STD-02',
    category: 'certificate',
    description: 'Certifies course completion and English medium of instruction for higher studies or visa.',
    eligibility: '3rd year, 4th year, or alumni students.',
    requiredFields: [
      { name: 'purpose', label: 'Purpose', type: 'select', options: ['Higher Education Abroad', 'Job Requirement', 'Visa Processing'], required: true },
      { name: 'universityName', label: 'Target Institution / Organization', type: 'text', required: true }
    ],
    requiredDocuments: [
      { id: 'doc-id-proof', name: 'Student College ID Card', description: 'Front & back scanned', allowedTypes: ['.pdf', '.jpg', '.png'], maxSizeMB: 5, required: true }
    ],
    targetDays: 3,
    requiresParentVerification: false,
    requiresHODApproval: true,
    department: 'Academic Registry'
  },
  {
    id: 'srv-conduct',
    title: 'Conduct & Character Certificate',
    code: 'CND-03',
    category: 'certificate',
    description: 'Document reflecting disciplinary history and moral conduct during institutional tenure.',
    eligibility: 'Students with clean disciplinary record verified by Department HOD.',
    requiredFields: [
      { name: 'purpose', label: 'Purpose', type: 'select', options: ['Employment Verification', 'Higher Studies Application', 'Competitive Exam'], required: true }
    ],
    requiredDocuments: [
      { id: 'doc-id-proof', name: 'Student ID Card', description: 'Proof of Identity', allowedTypes: ['.pdf', '.jpg', '.png'], maxSizeMB: 5, required: true }
    ],
    targetDays: 3,
    requiresParentVerification: true,
    requiresHODApproval: true,
    department: 'Student Affairs'
  },
  {
    id: 'srv-loan',
    title: 'Educational Loan Certificate & Fee Breakdown',
    code: 'LON-04',
    category: 'scholarship',
    description: 'Official fee structure breakdown letter endorsed for bank loan sanctioning.',
    eligibility: 'Enrolled students seeking bank financial assistance.',
    requiredFields: [
      { name: 'bankName', label: 'Bank Name & Branch', type: 'text', required: true },
      { name: 'loanAmount', label: 'Estimated Loan Amount (₹)', type: 'number', required: true },
      { name: 'academicYear', label: 'Academic Period', type: 'select', options: ['2026-2027', '2027-2028', 'Entire Course'], required: true }
    ],
    requiredDocuments: [
      { id: 'doc-admission-letter', name: 'Admission Offer Letter / Allotment Order', description: 'Official allotment letter', allowedTypes: ['.pdf'], maxSizeMB: 5, required: true },
      { id: 'doc-id-proof', name: 'Student ID Card', description: 'ID proof', allowedTypes: ['.pdf', '.jpg'], maxSizeMB: 5, required: true }
    ],
    targetDays: 3,
    requiresParentVerification: true,
    requiresHODApproval: true,
    department: 'Finance & Accounts'
  },
  {
    id: 'srv-noc-internship',
    title: 'Internship / Placement NOC Certificate',
    code: 'NOC-05',
    category: 'certificate',
    description: 'No Objection Certificate granted for external semester internships or industry projects.',
    eligibility: 'Students with minimum 75% attendance and no active academic backlogs.',
    requiredFields: [
      { name: 'companyName', label: 'Company / Organization Name', type: 'text', required: true },
      { name: 'startDate', label: 'Internship Start Date', type: 'date', required: true },
      { name: 'durationWeeks', label: 'Duration (Weeks)', type: 'number', required: true }
    ],
    requiredDocuments: [
      { id: 'doc-offer-letter', name: 'Official Internship Offer Letter', description: 'Offer letter from company on official letterhead', allowedTypes: ['.pdf'], maxSizeMB: 5, required: true }
    ],
    targetDays: 2,
    requiresParentVerification: true,
    requiresHODApproval: true,
    department: 'Career & Training Cell'
  },
  {
    id: 'srv-exam-reval',
    title: 'Exam Answer Script Revaluation Application',
    code: 'EXM-06',
    category: 'exam',
    description: 'Formal request for re-evaluating end-semester theory exam answer scripts.',
    eligibility: 'Submitted within 15 days of result publication date.',
    requiredFields: [
      { name: 'courseCode', label: 'Course Code & Name', type: 'text', required: true },
      { name: 'gradeObtained', label: 'Current Grade / Mark', type: 'text', required: true }
    ],
    requiredDocuments: [
      { id: 'doc-reval-fee', name: 'Revaluation Fee Payment Proof', description: 'Payment transaction receipt', allowedTypes: ['.pdf', '.jpg'], maxSizeMB: 5, required: true }
    ],
    targetDays: 5,
    requiresParentVerification: false,
    requiresHODApproval: true,
    department: 'Controller of Examinations'
  }
];

export const INITIAL_PARENT_VERIFICATIONS: ParentVerificationRecord[] = [
  {
    id: 'pv-001',
    applicationId: 'REQ-2026-00101',
    studentName: 'Alex Morgan',
    registerNumber: '2023CSE1042',
    serviceTitle: 'Bonafide Certificate',
    purpose: 'Passport Application',
    status: 'pending',
    token: 'token-parent-99218',
    expiresAt: new Date(Date.now() + 86400000 * 3).toISOString(),
    parentContact: 'parent.morgan@gmail.com (+91 98765 00001)'
  },
  {
    id: 'pv-002',
    applicationId: 'REQ-2026-00102',
    studentName: 'Alex Morgan',
    registerNumber: '2023CSE1042',
    serviceTitle: 'Educational Loan Certificate',
    purpose: 'Bank Loan Sanction (HDFC Bank)',
    status: 'verified',
    token: 'token-parent-11029',
    expiresAt: new Date(Date.now() - 3600000).toISOString(),
    parentContact: 'parent.morgan@gmail.com',
    verifiedAt: '2026-10-08T14:30:00.000Z'
  }
];

export const INITIAL_APPLICATIONS: ApplicationRequest[] = [
  {
    id: 'REQ-2026-00101',
    requestNumber: 'REQ-2026-00101',
    studentId: 'usr-student-1',
    studentName: 'Alex Morgan',
    registerNumber: '2023CSE1042',
    department: 'Computer Science & Engineering',
    yearOfStudy: 3,
    serviceId: 'srv-bonafide',
    serviceTitle: 'Bonafide Certificate',
    purpose: 'Passport Application',
    formData: { purpose: 'Passport Application', neededByDate: '2026-10-15', additionalNotes: 'Needed urgently for appointment.' },
    documents: [
      { id: 'doc-1', applicationId: 'REQ-2026-00101', name: 'Student College ID Card', fileUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80', fileType: 'image/jpeg', uploadedAt: '2026-10-08T10:00:00.000Z', status: 'verified', ocrCheckResult: { passed: true, detectedType: 'Student ID', confidence: 0.98 } },
      { id: 'doc-2', applicationId: 'REQ-2026-00101', name: 'Semester Fee Receipt', fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80', fileType: 'image/jpeg', uploadedAt: '2026-10-08T10:01:00.000Z', status: 'verified', ocrCheckResult: { passed: true, detectedType: 'Fee Receipt', confidence: 0.95 } }
    ],
    status: 'parent_verification_pending',
    currentStage: 'Parent Verification Required',
    submittedAt: '2026-10-08T10:05:00.000Z',
    updatedAt: '2026-10-08T10:10:00.000Z',
    targetCompletionDate: '2026-10-11T17:00:00.000Z',
    predictedCompletionDate: '2026-10-11T14:30:00.000Z',
    confidenceScore: 0.92,
    predictionFactors: ['Parent verification pending (avg +4h)', 'HOD review queue: 2 pending', 'Working days considered'],
    isDelayed: false,
    parentVerificationId: 'pv-001',
    parentVerificationStatus: 'pending',
    hodApprovalStatus: 'pending'
  },
  {
    id: 'REQ-2026-00102',
    requestNumber: 'REQ-2026-00102',
    studentId: 'usr-student-1',
    studentName: 'Alex Morgan',
    registerNumber: '2023CSE1042',
    department: 'Computer Science & Engineering',
    yearOfStudy: 3,
    serviceId: 'srv-loan',
    serviceTitle: 'Educational Loan Certificate & Fee Breakdown',
    purpose: 'Bank Loan Sanction (HDFC Bank)',
    formData: { bankName: 'HDFC Bank - Mg Road Branch', loanAmount: 180000, academicYear: '2026-2027' },
    documents: [
      { id: 'doc-3', applicationId: 'REQ-2026-00102', name: 'Admission Offer Letter', fileUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&auto=format&fit=crop&q=80', fileType: 'application/pdf', uploadedAt: '2026-10-07T09:00:00.000Z', status: 'verified', ocrCheckResult: { passed: true, detectedType: 'Allotment Order', confidence: 0.97 } }
    ],
    status: 'hod_pending',
    currentStage: 'Department HOD Approval Pending',
    submittedAt: '2026-10-07T09:15:00.000Z',
    updatedAt: '2026-10-08T14:30:00.000Z',
    targetCompletionDate: '2026-10-09T17:00:00.000Z',
    predictedCompletionDate: '2026-10-10T11:00:00.000Z',
    confidenceScore: 0.88,
    predictionFactors: ['Parent verified on Oct 8', 'HOD Dr. Vance review in progress', 'Department staff queue light'],
    isDelayed: true,
    delayReason: 'Pending HOD approval beyond 24h target due to departmental symposium.',
    parentVerificationId: 'pv-002',
    parentVerificationStatus: 'verified',
    hodApprovalStatus: 'pending'
  },
  {
    id: 'REQ-2026-00098',
    requestNumber: 'REQ-2026-00098',
    studentId: 'usr-student-1',
    studentName: 'Alex Morgan',
    registerNumber: '2023CSE1042',
    department: 'Computer Science & Engineering',
    yearOfStudy: 3,
    serviceId: 'srv-study',
    serviceTitle: 'Study / Medium of Instruction Certificate',
    purpose: 'Higher Studies Application',
    formData: { purpose: 'Higher Education Abroad', universityName: 'Technical University of Munich' },
    documents: [
      { id: 'doc-4', applicationId: 'REQ-2026-00098', name: 'Student College ID Card', fileUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80', fileType: 'image/jpeg', uploadedAt: '2026-10-04T11:00:00.000Z', status: 'verified' }
    ],
    status: 'ready_for_download',
    currentStage: 'Certificate Issued & Ready for Download',
    submittedAt: '2026-10-04T11:20:00.000Z',
    updatedAt: '2026-10-06T15:45:00.000Z',
    targetCompletionDate: '2026-10-07T17:00:00.000Z',
    predictedCompletionDate: '2026-10-06T15:45:00.000Z',
    confidenceScore: 0.99,
    predictionFactors: ['Completed ahead of target date'],
    isDelayed: false,
    parentVerificationStatus: 'not_started',
    hodApprovalStatus: 'approved',
    hodApprovedAt: '2026-10-05T14:10:00.000Z',
    issuedCertificateUrl: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'REQ-2026-00095',
    requestNumber: 'REQ-2026-00095',
    studentId: 'usr-student-1',
    studentName: 'Alex Morgan',
    registerNumber: '2023CSE1042',
    department: 'Computer Science & Engineering',
    yearOfStudy: 3,
    serviceId: 'srv-noc-internship',
    serviceTitle: 'Internship / Placement NOC Certificate',
    purpose: 'Summer Internship at TechCorp',
    formData: { companyName: 'TechCorp Solutions', startDate: '2026-11-01', durationWeeks: 12 },
    documents: [
      { id: 'doc-5', applicationId: 'REQ-2026-00095', name: 'Internship Offer Letter', fileUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&auto=format&fit=crop&q=80', fileType: 'application/pdf', uploadedAt: '2026-10-02T10:00:00.000Z', status: 'rejected', rejectionReason: 'Uploaded document is missing official company seal and authorized recruiter signature.' }
    ],
    status: 'doc_correction_required',
    currentStage: 'Correction Required from Student',
    submittedAt: '2026-10-02T10:15:00.000Z',
    updatedAt: '2026-10-03T11:00:00.000Z',
    targetCompletionDate: '2026-10-05T17:00:00.000Z',
    predictedCompletionDate: '2026-10-09T17:00:00.000Z',
    confidenceScore: 0.70,
    predictionFactors: ['Correction pending upload by student'],
    isDelayed: true,
    delayReason: 'Awaiting student response to upload valid offer letter with seal.',
    parentVerificationStatus: 'pending',
    hodApprovalStatus: 'pending',
    rejectionReason: 'Uploaded document is missing official company seal and authorized recruiter signature. Please upload a signed offer letter.'
  }
];

export const INITIAL_ACADEMIC_RECORDS: AcademicRecord[] = [
  {
    id: 'acad-101',
    studentId: 'usr-student-1',
    studentName: 'Alex Morgan',
    registerNumber: '2023CSE1042',
    department: 'Computer Science & Engineering',
    courseCode: 'CS301',
    courseName: 'Database Management Systems',
    totalClasses: 45,
    attendedClasses: 30,
    attendancePercentage: 66.7, // Below 75%!
    internalMark: 14,
    maxInternalMark: 25,
    normalizedMarkPercentage: 56.0,
    updatedAt: '2026-10-08T18:00:00.000Z'
  },
  {
    id: 'acad-102',
    studentId: 'usr-student-1',
    studentName: 'Alex Morgan',
    registerNumber: '2023CSE1042',
    department: 'Computer Science & Engineering',
    courseCode: 'CS302',
    courseName: 'Design & Analysis of Algorithms',
    totalClasses: 42,
    attendedClasses: 36,
    attendancePercentage: 85.7,
    internalMark: 11, // Low internal mark! (11/25 = 44%)
    maxInternalMark: 25,
    normalizedMarkPercentage: 44.0,
    updatedAt: '2026-10-08T18:00:00.000Z'
  },
  {
    id: 'acad-103',
    studentId: 'usr-student-1',
    studentName: 'Alex Morgan',
    registerNumber: '2023CSE1042',
    department: 'Computer Science & Engineering',
    courseCode: 'CS303',
    courseName: 'Artificial Intelligence & Machine Learning',
    totalClasses: 40,
    attendedClasses: 38,
    attendancePercentage: 95.0,
    internalMark: 23,
    maxInternalMark: 25,
    normalizedMarkPercentage: 92.0,
    updatedAt: '2026-10-08T18:00:00.000Z'
  }
];

export const INITIAL_THRESHOLDS: AcademicThreshold[] = [
  {
    id: 'thresh-cse',
    department: 'Computer Science & Engineering',
    minAttendancePercentage: 75.0,
    minInternalMarkPercentage: 50.0,
    internalMarkScale: 25,
    updatedAt: '2026-10-01T00:00:00.000Z'
  },
  {
    id: 'thresh-ece',
    department: 'Electronics & Communication',
    minAttendancePercentage: 75.0,
    minInternalMarkPercentage: 50.0,
    internalMarkScale: 25,
    updatedAt: '2026-10-01T00:00:00.000Z'
  }
];

export const INITIAL_ACADEMIC_ALERTS: AcademicAlert[] = [
  {
    id: 'alert-001',
    studentId: 'usr-student-1',
    studentName: 'Alex Morgan',
    registerNumber: '2023CSE1042',
    department: 'Computer Science & Engineering',
    type: 'attendance',
    courseCode: 'CS301',
    courseName: 'Database Management Systems',
    currentValue: 66.7,
    thresholdValue: 75.0,
    severity: 'warning',
    status: 'active',
    createdAt: '2026-10-08T18:05:00.000Z',
    guidanceText: 'Your attendance in CS301 (66.7%) is below the mandatory 75% threshold. Please meet Prof. Jenkins or submit medical certificates if applicable.'
  },
  {
    id: 'alert-002',
    studentId: 'usr-student-1',
    studentName: 'Alex Morgan',
    registerNumber: '2023CSE1042',
    department: 'Computer Science & Engineering',
    type: 'internal_marks',
    courseCode: 'CS302',
    courseName: 'Design & Analysis of Algorithms',
    currentValue: 44.0,
    thresholdValue: 50.0,
    severity: 'warning',
    status: 'active',
    createdAt: '2026-10-08T18:05:00.000Z',
    guidanceText: 'Your Internal Assessment mark in CS302 (11/25 = 44%) is below the 50% passing target. Remedial coaching classes are available on Tuesdays.'
  }
];

export const FOOD_PRODUCTS: FoodProduct[] = [
  {
    id: 'fd-01',
    name: 'South Indian Combo Dosa & Vada',
    description: 'Crispy golden ghee paper dosa served with 2 crispy vada, coconut chutney & sambar.',
    category: 'Breakfast',
    price: 95,
    stock: 40,
    isAvailable: true,
    preparationTimeMinutes: 10,
    imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'fd-02',
    name: 'Executive Deluxe Thali Meal',
    description: 'Basmati rice, paneer butter masala, dal makhani, 2 butter rotis, salad, curd & gulab jamun.',
    category: 'Meals',
    price: 160,
    stock: 35,
    isAvailable: true,
    preparationTimeMinutes: 12,
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'fd-03',
    name: 'Grilled Paneer Tikka Sandwich',
    description: 'Multigrain bread grilled with marinated cottage cheese, bell peppers, mint chutney & cheese.',
    category: 'Snacks',
    price: 110,
    stock: 25,
    isAvailable: true,
    preparationTimeMinutes: 8,
    imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'fd-04',
    name: 'Fresh Mango Mint Cold Smoothie',
    description: 'Chilled Alphonso mango pulp blended with Greek yogurt, mint & honey.',
    category: 'Beverages',
    price: 75,
    stock: 50,
    isAvailable: true,
    preparationTimeMinutes: 5,
    imageUrl: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'fd-05',
    name: 'Double Chocolate Fudge Brownie',
    description: 'Warm dark chocolate brownie topped with chocolate syrup & choco chips.',
    category: 'Bakery',
    price: 80,
    stock: 18,
    isAvailable: true,
    preparationTimeMinutes: 3,
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'fd-06',
    name: 'Chef Special Schezwan Fried Rice',
    description: 'Spicy Schezwan wok-tossed jasmine rice loaded with fresh veggies & spring onions.',
    category: 'Specials',
    price: 140,
    stock: 30,
    isAvailable: true,
    preparationTimeMinutes: 15,
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&auto=format&fit=crop&q=80'
  }
];

export const STATIONERY_PRODUCTS: StationeryProduct[] = [
  {
    id: 'st-01',
    name: '200-Page A4 Spiral Class Notebook',
    description: 'High-gsm fountain-pen friendly ruled paper with durable polypropylene cover.',
    category: 'Notebooks',
    price: 120,
    stock: 120,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'st-02',
    name: 'Executive Fine-Tip Gel Pen Set (Pack of 5)',
    description: 'Smooth 0.5mm waterproof quick-dry Japanese blue ink pens.',
    category: 'Pens & Pencils',
    price: 90,
    stock: 85,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1585336261026-6757c5bca74d?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'st-03',
    name: 'Engineering Hardcover Record File',
    description: 'Bound lab practical record notebook with graph sheets and index.',
    category: 'Lab Supplies',
    price: 180,
    stock: 45,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'st-04',
    name: 'Drafting Engineering Drawing Kit',
    description: 'Includes mini-drafter, set squares, protractor, compass set, and A2 sheet holder container.',
    category: 'Drawing',
    price: 450,
    stock: 20,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'st-05',
    name: 'Project Document Portfolio Ring Binder',
    description: 'A4 clear view display file folder with 30 transparent sheet protectors.',
    category: 'Files & Folders',
    price: 140,
    stock: 60,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'st-06',
    name: 'Laser Document Printing & Binding (Per 50 pages)',
    description: 'High resolution duplex B/W printing with soft spiral binding.',
    category: 'Printing',
    price: 100,
    stock: 500,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=500&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_ORDERS: CampusOrder[] = [
  {
    id: 'ORD-FDC-88401',
    orderNumber: 'ORD-FDC-88401',
    userId: 'usr-student-1',
    userName: 'Alex Morgan',
    userRole: 'student',
    storeType: 'food',
    items: [
      { productId: 'fd-01', name: 'South Indian Combo Dosa & Vada', price: 95, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=80', storeType: 'food' },
      { productId: 'fd-04', name: 'Fresh Mango Mint Cold Smoothie', price: 75, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=500&auto=format&fit=crop&q=80', storeType: 'food' }
    ],
    subtotal: 170,
    tax: 8.5,
    total: 178.5,
    paymentStatus: 'completed',
    paymentMethod: 'razorpay',
    transactionRef: 'pay_Nzk829104812',
    orderStatus: 'ready_for_collection',
    qrCodeData: 'ORD-FDC-88401::token-fdc-99201',
    qrToken: 'token-fdc-99201',
    createdAt: '2026-10-09T04:15:00.000Z'
  },
  {
    id: 'ORD-STN-30112',
    orderNumber: 'ORD-STN-30112',
    userId: 'usr-student-1',
    userName: 'Alex Morgan',
    userRole: 'student',
    storeType: 'stationery',
    items: [
      { productId: 'st-01', name: '200-Page A4 Spiral Class Notebook', price: 120, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80', storeType: 'stationery' }
    ],
    subtotal: 240,
    tax: 12,
    total: 252,
    paymentStatus: 'completed',
    paymentMethod: 'demo_upi',
    transactionRef: 'pay_STN_7720194',
    orderStatus: 'confirmed',
    qrCodeData: 'ORD-STN-30112::token-stn-44019',
    qrToken: 'token-stn-44019',
    createdAt: '2026-10-09T03:30:00.000Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditEvent[] = [
  {
    id: 'aud-001',
    requestId: 'REQ-2026-00101',
    actorId: 'usr-student-1',
    actorName: 'Alex Morgan',
    actorRole: 'student',
    action: 'Request Submitted',
    details: 'Submitted Bonafide Certificate request for Passport Application',
    timestamp: '2026-10-08T10:05:00.000Z',
    newStatus: 'submitted'
  },
  {
    id: 'aud-002',
    requestId: 'REQ-2026-00101',
    actorId: 'sys-ocr-bot',
    actorName: 'AI Document Verifier',
    actorRole: 'admin',
    action: 'Document Pre-check Completed',
    details: 'OCR verified Student ID Card and Semester Fee Receipt with 96% confidence',
    timestamp: '2026-10-08T10:06:00.000Z',
    previousStatus: 'submitted',
    newStatus: 'doc_verification'
  },
  {
    id: 'aud-003',
    requestId: 'REQ-2026-00101',
    actorId: 'sys-workflow',
    actorName: 'System Engine',
    actorRole: 'admin',
    action: 'Parent Verification Initiated',
    details: 'Parent verification link token generated & sent to parent.morgan@gmail.com',
    timestamp: '2026-10-08T10:10:00.000Z',
    previousStatus: 'doc_verification',
    newStatus: 'parent_verification_pending'
  }
];
