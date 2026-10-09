export type UserRole = 
  | 'student' 
  | 'staff' 
  | 'hod' 
  | 'admin' 
  | 'food_staff' 
  | 'stationery_staff';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  registerNumber?: string;
  employeeId?: string;
  role: UserRole;
  department: string;
  yearOfStudy?: number;
  phone?: string;
  avatarUrl?: string;
  parentEmail?: string;
  parentPhone?: string;
}

export type ApplicationStatus = 
  | 'draft'
  | 'submitted'
  | 'doc_verification'
  | 'doc_correction_required'
  | 'parent_verification_pending'
  | 'parent_verified'
  | 'parent_rejected'
  | 'hod_pending'
  | 'hod_approved'
  | 'hod_rejected'
  | 'processing'
  | 'ready_for_download'
  | 'completed'
  | 'rejected';

export type ServiceCategory = 
  | 'certificate'
  | 'scholarship'
  | 'exam'
  | 'fee'
  | 'hostel_transport'
  | 'clearance';

export interface ServiceDefinition {
  id: string;
  title: string;
  code: string;
  category: ServiceCategory;
  description: string;
  eligibility: string;
  requiredFields: Array<{
    name: string;
    label: string;
    type: 'text' | 'select' | 'date' | 'textarea' | 'number';
    options?: string[];
    required: boolean;
  }>;
  requiredDocuments: Array<{
    id: string;
    name: string;
    description: string;
    allowedTypes: string[];
    maxSizeMB: number;
    required: boolean;
  }>;
  targetDays: number;
  requiresParentVerification: boolean;
  requiresHODApproval: boolean;
  department: string;
}

export interface ApplicationDocument {
  id: string;
  applicationId: string;
  name: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: string;
  status: 'pending' | 'verified' | 'rejected';
  rejectionReason?: string;
  ocrCheckResult?: {
    passed: boolean;
    detectedType: string;
    confidence: number;
    issuesFound?: string[];
  };
}

export interface ParentVerificationRecord {
  id: string;
  applicationId: string;
  studentName: string;
  registerNumber: string;
  serviceTitle: string;
  purpose: string;
  status: 'not_started' | 'pending' | 'verified' | 'rejected' | 'expired';
  token: string;
  expiresAt: string;
  parentContact: string;
  verifiedAt?: string;
  rejectionReason?: string;
}

export interface ApplicationRequest {
  id: string;
  requestNumber: string;
  studentId: string;
  studentName: string;
  registerNumber: string;
  department: string;
  yearOfStudy: number;
  serviceId: string;
  serviceTitle: string;
  purpose: string;
  formData: Record<string, any>;
  documents: ApplicationDocument[];
  status: ApplicationStatus;
  currentStage: string;
  submittedAt: string;
  updatedAt: string;
  targetCompletionDate: string;
  predictedCompletionDate: string;
  confidenceScore: number;
  predictionFactors: string[];
  isDelayed: boolean;
  delayReason?: string;
  parentVerificationId?: string;
  parentVerificationStatus: 'not_started' | 'pending' | 'verified' | 'rejected' | 'expired';
  hodApprovalStatus: 'pending' | 'approved' | 'rejected' | 'not_required';
  hodApprovedAt?: string;
  hodRejectionReason?: string;
  rejectionReason?: string;
  issuedCertificateUrl?: string;
}

export interface AuditEvent {
  id: string;
  requestId?: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  details: string;
  timestamp: string;
  previousStatus?: string;
  newStatus?: string;
}

export interface AcademicRecord {
  id: string;
  studentId: string;
  studentName: string;
  registerNumber: string;
  department: string;
  courseCode: string;
  courseName: string;
  totalClasses: number;
  attendedClasses: number;
  attendancePercentage: number;
  internalMark: number;
  maxInternalMark: number;
  normalizedMarkPercentage: number;
  updatedAt: string;
}

export interface AcademicThreshold {
  id: string;
  department: string;
  minAttendancePercentage: number;
  minInternalMarkPercentage: number;
  internalMarkScale: number;
  updatedAt: string;
}

export interface AcademicAlert {
  id: string;
  studentId: string;
  studentName: string;
  registerNumber: string;
  department: string;
  type: 'attendance' | 'internal_marks';
  courseCode: string;
  courseName: string;
  currentValue: number;
  thresholdValue: number;
  severity: 'warning' | 'critical';
  status: 'active' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
  guidanceText: string;
}

export interface FoodProduct {
  id: string;
  name: string;
  description: string;
  category: 'Breakfast' | 'Meals' | 'Snacks' | 'Beverages' | 'Bakery' | 'Specials';
  price: number;
  stock: number;
  isAvailable: boolean;
  preparationTimeMinutes: number;
  imageUrl: string;
}

export interface StationeryProduct {
  id: string;
  name: string;
  description: string;
  category: 'Notebooks' | 'Pens & Pencils' | 'Files & Folders' | 'Lab Supplies' | 'Drawing' | 'Printing' | 'General';
  price: number;
  stock: number;
  isAvailable: boolean;
  imageUrl: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  storeType: 'food' | 'stationery';
}

export interface CampusOrder {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  storeType: 'food' | 'stationery';
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'razorpay' | 'demo_upi' | 'demo_card';
  transactionRef: string;
  orderStatus: 'confirmed' | 'preparing' | 'ready_for_collection' | 'collected' | 'cancelled';
  qrCodeData: string;
  qrToken: string;
  createdAt: string;
  collectedAt?: string;
  collectedByStaffId?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ServiceFeedback {
  id: string;
  requestId: string;
  studentId: string;
  studentName: string;
  rating: number; // 1 to 5
  timeSatisfaction: number; // 1 to 5
  claritySatisfaction: number;
  easeOfUse: number;
  comments?: string;
  createdAt: string;
}
