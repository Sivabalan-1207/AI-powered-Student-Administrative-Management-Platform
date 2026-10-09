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
  CartItem,
  AuditEvent,
  AppNotification,
  ServiceFeedback
} from '../types';

import {
  DEMO_USERS,
  SERVICES_CATALOG,
  INITIAL_APPLICATIONS,
  INITIAL_PARENT_VERIFICATIONS,
  INITIAL_ACADEMIC_RECORDS,
  INITIAL_THRESHOLDS,
  INITIAL_ACADEMIC_ALERTS,
  FOOD_PRODUCTS,
  STATIONERY_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_AUDIT_LOGS
} from '../data/mockData';

const LOCAL_STORAGE_KEY = 'campusconnect_store_v1';

interface AppStoreState {
  currentUser: UserProfile;
  demoUsers: UserProfile[];
  services: ServiceDefinition[];
  applications: ApplicationRequest[];
  parentVerifications: ParentVerificationRecord[];
  academicRecords: AcademicRecord[];
  thresholds: AcademicThreshold[];
  academicAlerts: AcademicAlert[];
  foodProducts: FoodProduct[];
  stationeryProducts: StationeryProduct[];
  cart: CartItem[];
  orders: CampusOrder[];
  auditLogs: AuditEvent[];
  notifications: AppNotification[];
  feedbacks: ServiceFeedback[];
}

class StoreManager {
  private state: AppStoreState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadInitialState();
  }

  private loadInitialState(): AppStoreState {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          services: SERVICES_CATALOG // always keep fresh services catalog
        };
      }
    } catch (e) {
      console.warn('Failed to load local storage state:', e);
    }

    return {
      currentUser: DEMO_USERS[0], // Default: Alex Morgan (Student)
      demoUsers: DEMO_USERS,
      services: SERVICES_CATALOG,
      applications: INITIAL_APPLICATIONS,
      parentVerifications: INITIAL_PARENT_VERIFICATIONS,
      academicRecords: INITIAL_ACADEMIC_RECORDS,
      thresholds: INITIAL_THRESHOLDS,
      academicAlerts: INITIAL_ACADEMIC_ALERTS,
      foodProducts: FOOD_PRODUCTS,
      stationeryProducts: STATIONERY_PRODUCTS,
      cart: [],
      orders: INITIAL_ORDERS,
      auditLogs: INITIAL_AUDIT_LOGS,
      notifications: [
        {
          id: 'notif-1',
          userId: 'usr-student-1',
          title: 'Parent Verification Pending',
          message: 'Your Bonafide Certificate request (REQ-2026-00101) requires parent verification.',
          type: 'warning',
          isRead: false,
          createdAt: new Date().toISOString()
        },
        {
          id: 'notif-2',
          userId: 'usr-student-1',
          title: 'Academic Alert: Attendance Warning',
          message: 'Your attendance in CS301 (DBMS) is currently 66.7%, below the 75% threshold.',
          type: 'error',
          isRead: false,
          createdAt: new Date(Date.now() - 3600000).toISOString()
        }
      ],
      feedbacks: []
    };
  }

  private persist() {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to persist state:', e);
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  public getState(): AppStoreState {
    return this.state;
  }

  public resetToDefaultDemo() {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    this.state = {
      currentUser: DEMO_USERS[0],
      demoUsers: DEMO_USERS,
      services: SERVICES_CATALOG,
      applications: INITIAL_APPLICATIONS,
      parentVerifications: INITIAL_PARENT_VERIFICATIONS,
      academicRecords: INITIAL_ACADEMIC_RECORDS,
      thresholds: INITIAL_THRESHOLDS,
      academicAlerts: INITIAL_ACADEMIC_ALERTS,
      foodProducts: FOOD_PRODUCTS,
      stationeryProducts: STATIONERY_PRODUCTS,
      cart: [],
      orders: INITIAL_ORDERS,
      auditLogs: INITIAL_AUDIT_LOGS,
      notifications: [],
      feedbacks: []
    };
    this.persist();
  }

  // ================= USER & AUTH =================
  public setCurrentUser(user: UserProfile) {
    this.state.currentUser = user;
    this.persist();
  }

  public switchUserByRole(role: UserProfile['role']) {
    const found = this.state.demoUsers.find((u) => u.role === role);
    if (found) {
      this.state.currentUser = found;
      this.persist();
    }
  }

  // ================= APPLICATION WORKFLOW =================
  public submitApplication(payload: {
    serviceId: string;
    purpose: string;
    formData: Record<string, any>;
    uploadedDocs: Array<{ name: string; fileUrl: string; fileType: string }>;
  }): ApplicationRequest {
    const service = this.state.services.find((s) => s.id === payload.serviceId);
    if (!service) throw new Error('Selected service not found.');

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const requestId = `REQ-2026-${randomNum}`;
    const student = this.state.currentUser;

    const targetDays = service.targetDays || 3;
    const targetCompletionDate = new Date(Date.now() + targetDays * 86400000).toISOString();
    
    // AI Completion Estimation formula
    const queueLength = this.state.applications.filter((a) => a.status === 'processing' || a.status === 'hod_pending').length;
    const predictedDays = targetDays + (queueLength > 3 ? 1 : 0);
    const predictedCompletionDate = new Date(Date.now() + predictedDays * 86400000).toISOString();

    const parentVerificationId = service.requiresParentVerification ? `pv-${randomNum}` : undefined;
    const parentToken = `token-parent-${randomNum}`;

    let parentRecord: ParentVerificationRecord | undefined;
    if (service.requiresParentVerification) {
      parentRecord = {
        id: parentVerificationId!,
        applicationId: requestId,
        studentName: student.name,
        registerNumber: student.registerNumber || '2023CSE1042',
        serviceTitle: service.title,
        purpose: payload.purpose,
        status: 'pending',
        token: parentToken,
        expiresAt: new Date(Date.now() + 86400000 * 3).toISOString(),
        parentContact: student.parentEmail || student.parentPhone || 'parent@example.com'
      };
      this.state.parentVerifications.unshift(parentRecord);
    }

    // Run AI OCR pre-checks
    const processedDocs = payload.uploadedDocs.map((doc, idx) => ({
      id: `doc-${requestId}-${idx + 1}`,
      applicationId: requestId,
      name: doc.name,
      fileUrl: doc.fileUrl,
      fileType: doc.fileType,
      uploadedAt: new Date().toISOString(),
      status: 'verified' as const,
      ocrCheckResult: {
        passed: true,
        detectedType: doc.name.includes('ID') ? 'Student ID Card' : 'Fee Receipt / Document',
        confidence: 0.96
      }
    }));

    const initialStatus = service.requiresParentVerification
      ? 'parent_verification_pending'
      : service.requiresHODApproval
      ? 'hod_pending'
      : 'processing';

    const initialStage = service.requiresParentVerification
      ? 'Parent Verification Required'
      : service.requiresHODApproval
      ? 'Department HOD Approval Pending'
      : 'Administrative Processing';

    const newRequest: ApplicationRequest = {
      id: requestId,
      requestNumber: requestId,
      studentId: student.id,
      studentName: student.name,
      registerNumber: student.registerNumber || '2023CSE1042',
      department: student.department,
      yearOfStudy: student.yearOfStudy || 3,
      serviceId: service.id,
      serviceTitle: service.title,
      purpose: payload.purpose,
      formData: payload.formData,
      documents: processedDocs,
      status: initialStatus,
      currentStage: initialStage,
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      targetCompletionDate,
      predictedCompletionDate,
      confidenceScore: 0.91,
      predictionFactors: [
        `Base service time: ${targetDays} days`,
        service.requiresParentVerification ? 'Parent verification stage (+4-12h)' : 'Direct staff routing',
        `Current department queue: ${queueLength} active requests`
      ],
      isDelayed: false,
      parentVerificationId,
      parentVerificationStatus: service.requiresParentVerification ? 'pending' : 'not_started',
      hodApprovalStatus: service.requiresHODApproval ? 'pending' : 'not_required'
    };

    this.state.applications.unshift(newRequest);

    // Audit Event
    this.addAuditLog({
      requestId,
      actorId: student.id,
      actorName: student.name,
      actorRole: student.role,
      action: 'Request Submitted',
      details: `Submitted application for ${service.title} (${payload.purpose})`,
      newStatus: initialStatus
    });

    // Notification to student
    this.addNotification({
      userId: student.id,
      title: 'Application Submitted',
      message: `Your request ${requestId} for ${service.title} has been submitted successfully.`,
      type: 'info'
    });

    this.persist();
    return newRequest;
  }

  public verifyParentRequest(token: string, approve: boolean, rejectionReason?: string): ParentVerificationRecord | null {
    const record = this.state.parentVerifications.find((p) => p.token === token);
    if (!record) return null;

    record.status = approve ? 'verified' : 'rejected';
    record.verifiedAt = new Date().toISOString();
    if (!approve) record.rejectionReason = rejectionReason || 'Parent declined verification.';

    // Update parent verification in the application
    const app = this.state.applications.find((a) => a.id === record.applicationId);
    if (app) {
      if (approve) {
        app.parentVerificationStatus = 'verified';
        app.status = 'hod_pending';
        app.currentStage = 'Department HOD Approval Pending';
        app.updatedAt = new Date().toISOString();
        
        this.addAuditLog({
          requestId: app.id,
          actorId: 'parent-actor',
          actorName: `Parent of ${app.studentName}`,
          actorRole: 'student',
          action: 'Parent Verification Approved',
          details: 'Parent independently verified request details via secure verification portal.',
          previousStatus: 'parent_verification_pending',
          newStatus: 'hod_pending'
        });

        this.addNotification({
          userId: app.studentId,
          title: 'Parent Verification Completed',
          message: `Your parent has approved request ${app.requestNumber}. Now forwarded for HOD approval.`,
          type: 'success'
        });
      } else {
        app.parentVerificationStatus = 'rejected';
        app.status = 'rejected';
        app.currentStage = 'Rejected during Parent Verification';
        app.rejectionReason = rejectionReason || 'Parent declined the certificate request.';
        app.updatedAt = new Date().toISOString();

        this.addAuditLog({
          requestId: app.id,
          actorId: 'parent-actor',
          actorName: `Parent of ${app.studentName}`,
          actorRole: 'student',
          action: 'Parent Verification Rejected',
          details: `Parent rejected request: ${record.rejectionReason}`,
          previousStatus: 'parent_verification_pending',
          newStatus: 'rejected'
        });

        this.addNotification({
          userId: app.studentId,
          title: 'Request Rejected by Parent',
          message: `Parent verification failed for ${app.requestNumber}. Reason: ${record.rejectionReason}`,
          type: 'error'
        });
      }
    }

    this.persist();
    return record;
  }

  // MANDATORY RULE: HOD approval is locked on server/store until parent verification status is verified!
  public hodApproveRequest(requestId: string, approve: boolean, reason?: string) {
    const app = this.state.applications.find((a) => a.id === requestId);
    if (!app) throw new Error('Request not found');

    const service = this.state.services.find((s) => s.id === app.serviceId);
    if (service?.requiresParentVerification && app.parentVerificationStatus !== 'verified') {
      throw new Error('MANDATORY CONTROL: HOD cannot approve a request prior to successful parent verification!');
    }

    const hod = this.state.currentUser;

    if (approve) {
      app.hodApprovalStatus = 'approved';
      app.hodApprovedAt = new Date().toISOString();
      app.status = 'processing';
      app.currentStage = 'Administrative Certificate Processing & Seal';
      app.updatedAt = new Date().toISOString();

      this.addAuditLog({
        requestId: app.id,
        actorId: hod.id,
        actorName: hod.name,
        actorRole: hod.role,
        action: 'HOD Department Approved',
        details: 'HOD reviewed student credentials & parent verification, granted approval.',
        previousStatus: 'hod_pending',
        newStatus: 'processing'
      });

      this.addNotification({
        userId: app.studentId,
        title: 'HOD Approval Granted',
        message: `HOD ${hod.name} approved your request ${app.requestNumber}. Now in administrative processing.`,
        type: 'success'
      });
    } else {
      app.hodApprovalStatus = 'rejected';
      app.status = 'rejected';
      app.currentStage = 'Rejected by HOD';
      app.rejectionReason = reason || 'Department HOD declined the request.';
      app.updatedAt = new Date().toISOString();

      this.addAuditLog({
        requestId: app.id,
        actorId: hod.id,
        actorName: hod.name,
        actorRole: hod.role,
        action: 'HOD Approval Rejected',
        details: `HOD rejected request. Reason: ${app.rejectionReason}`,
        previousStatus: 'hod_pending',
        newStatus: 'rejected'
      });

      this.addNotification({
        userId: app.studentId,
        title: 'Application Rejected by HOD',
        message: `Your request ${app.requestNumber} was rejected by HOD. Reason: ${app.rejectionReason}`,
        type: 'error'
      });
    }

    this.persist();
  }

  public completeCertificateProcessing(requestId: string, certificateUrl?: string) {
    const app = this.state.applications.find((a) => a.id === requestId);
    if (!app) return;

    const staff = this.state.currentUser;
    app.status = 'ready_for_download';
    app.currentStage = 'Certificate Issued & Ready for Download';
    app.issuedCertificateUrl = certificateUrl || 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&auto=format&fit=crop&q=80';
    app.updatedAt = new Date().toISOString();

    this.addAuditLog({
      requestId: app.id,
      actorId: staff.id,
      actorName: staff.name,
      actorRole: staff.role,
      action: 'Certificate Finalized & Issued',
      details: 'Digital certificate generated with seal and signed QR validation.',
      previousStatus: 'processing',
      newStatus: 'ready_for_download'
    });

    this.addNotification({
      userId: app.studentId,
      title: 'Certificate Ready for Download!',
      message: `Your ${app.serviceTitle} (${app.requestNumber}) has been issued and is available for instant download.`,
      type: 'success'
    });

    this.persist();
  }

  public requestDocumentCorrection(requestId: string, reason: string) {
    const app = this.state.applications.find((a) => a.id === requestId);
    if (!app) return;

    app.status = 'doc_correction_required';
    app.currentStage = 'Correction Required from Student';
    app.rejectionReason = reason;
    app.updatedAt = new Date().toISOString();

    this.addAuditLog({
      requestId: app.id,
      actorId: this.state.currentUser.id,
      actorName: this.state.currentUser.name,
      actorRole: this.state.currentUser.role,
      action: 'Document Correction Requested',
      details: `Staff requested correction: ${reason}`,
      newStatus: 'doc_correction_required'
    });

    this.addNotification({
      userId: app.studentId,
      title: 'Document Correction Needed',
      message: `Correction requested for request ${app.requestNumber}. Reason: ${reason}`,
      type: 'warning'
    });

    this.persist();
  }

  // ================= ACADEMIC MONITORING =================
  public updateAcademicThreshold(department: string, minAttendance: number, minInternalMarkPct: number) {
    let thresh = this.state.thresholds.find((t) => t.department === department);
    if (!thresh) {
      thresh = {
        id: `thresh-${department.toLowerCase().replace(/\s+/g, '-')}`,
        department,
        minAttendancePercentage: minAttendance,
        minInternalMarkPercentage: minInternalMarkPct,
        internalMarkScale: 25,
        updatedAt: new Date().toISOString()
      };
      this.state.thresholds.push(thresh);
    } else {
      thresh.minAttendancePercentage = minAttendance;
      thresh.minInternalMarkPercentage = minInternalMarkPct;
      thresh.updatedAt = new Date().toISOString();
    }

    // Re-evaluate all academic alerts based on updated thresholds
    this.reevaluateAcademicAlerts();
    this.persist();
  }

  public updateStudentAcademicRecord(recordId: string, attended: number, total: number, mark: number) {
    const rec = this.state.academicRecords.find((r) => r.id === recordId);
    if (!rec) return;

    rec.attendedClasses = attended;
    rec.totalClasses = total;
    rec.attendancePercentage = Number(((attended / total) * 100).toFixed(1));
    rec.internalMark = mark;
    rec.normalizedMarkPercentage = Number(((mark / rec.maxInternalMark) * 100).toFixed(1));
    rec.updatedAt = new Date().toISOString();

    this.reevaluateAcademicAlerts();
    this.persist();
  }

  private reevaluateAcademicAlerts() {
    this.state.academicRecords.forEach((rec) => {
      const thresh = this.state.thresholds.find((t) => t.department === rec.department) || {
        minAttendancePercentage: 75.0,
        minInternalMarkPercentage: 50.0
      };

      // Check attendance
      const existingAttendanceAlert = this.state.academicAlerts.find(
        (a) => a.studentId === rec.studentId && a.courseCode === rec.courseCode && a.type === 'attendance'
      );

      if (rec.attendancePercentage < thresh.minAttendancePercentage) {
        if (!existingAttendanceAlert) {
          const newAlert: AcademicAlert = {
            id: `alert-att-${Date.now()}-${rec.id}`,
            studentId: rec.studentId,
            studentName: rec.studentName,
            registerNumber: rec.registerNumber,
            department: rec.department,
            type: 'attendance',
            courseCode: rec.courseCode,
            courseName: rec.courseName,
            currentValue: rec.attendancePercentage,
            thresholdValue: thresh.minAttendancePercentage,
            severity: rec.attendancePercentage < 60 ? 'critical' : 'warning',
            status: 'active',
            createdAt: new Date().toISOString(),
            guidanceText: `Attendance is ${rec.attendancePercentage}%, which is below the minimum required ${thresh.minAttendancePercentage}%. Contact course instructor immediately.`
          };
          this.state.academicAlerts.unshift(newAlert);
          
          this.addNotification({
            userId: rec.studentId,
            title: 'Automatic Academic Alert: Attendance Warning',
            message: `Your attendance in ${rec.courseCode} (${rec.attendancePercentage}%) dropped below ${thresh.minAttendancePercentage}%.`,
            type: 'error'
          });
        } else {
          existingAttendanceAlert.currentValue = rec.attendancePercentage;
          existingAttendanceAlert.status = 'active';
        }
      } else if (existingAttendanceAlert && existingAttendanceAlert.status === 'active') {
        existingAttendanceAlert.status = 'resolved';
        existingAttendanceAlert.resolvedAt = new Date().toISOString();
      }

      // Check internal marks
      const existingMarkAlert = this.state.academicAlerts.find(
        (a) => a.studentId === rec.studentId && a.courseCode === rec.courseCode && a.type === 'internal_marks'
      );

      if (rec.normalizedMarkPercentage < thresh.minInternalMarkPercentage) {
        if (!existingMarkAlert) {
          const newAlert: AcademicAlert = {
            id: `alert-mrk-${Date.now()}-${rec.id}`,
            studentId: rec.studentId,
            studentName: rec.studentName,
            registerNumber: rec.registerNumber,
            department: rec.department,
            type: 'internal_marks',
            courseCode: rec.courseCode,
            courseName: rec.courseName,
            currentValue: rec.normalizedMarkPercentage,
            thresholdValue: thresh.minInternalMarkPercentage,
            severity: 'warning',
            status: 'active',
            createdAt: new Date().toISOString(),
            guidanceText: `Internal test score (${rec.internalMark}/${rec.maxInternalMark} = ${rec.normalizedMarkPercentage}%) is below passing threshold ${thresh.minInternalMarkPercentage}%.`
          };
          this.state.academicAlerts.unshift(newAlert);
          
          this.addNotification({
            userId: rec.studentId,
            title: 'Automatic Academic Alert: Internal Mark Low',
            message: `Your internal assessment mark in ${rec.courseCode} is below threshold (${rec.normalizedMarkPercentage}%).`,
            type: 'warning'
          });
        } else {
          existingMarkAlert.currentValue = rec.normalizedMarkPercentage;
          existingMarkAlert.status = 'active';
        }
      } else if (existingMarkAlert && existingMarkAlert.status === 'active') {
        existingMarkAlert.status = 'resolved';
        existingMarkAlert.resolvedAt = new Date().toISOString();
      }
    });
  }

  // ================= CAMPUS SHOPPING: FOOD COURT & STATIONERY =================
  public addToCart(item: CartItem) {
    const existing = this.state.cart.find(
      (c) => c.productId === item.productId && c.storeType === item.storeType
    );
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      this.state.cart.push({ ...item });
    }
    this.persist();
  }

  public updateCartQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      this.state.cart = this.state.cart.filter((c) => c.productId !== productId);
    } else {
      const item = this.state.cart.find((c) => c.productId === productId);
      if (item) item.quantity = quantity;
    }
    this.persist();
  }

  public clearCart() {
    this.state.cart = [];
    this.persist();
  }

  public placeOrder(
    storeType: 'food' | 'stationery',
    paymentMethod: 'razorpay' | 'demo_upi' | 'demo_card'
  ): CampusOrder {
    const storeItems = this.state.cart.filter((i) => i.storeType === storeType);
    if (storeItems.length === 0) throw new Error('Cart is empty for this store.');

    // Validate stock and reserve items
    storeItems.forEach((item) => {
      if (storeType === 'food') {
        const prod = this.state.foodProducts.find((p) => p.id === item.productId);
        if (!prod || prod.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${item.name}`);
        }
        prod.stock -= item.quantity;
        if (prod.stock === 0) prod.isAvailable = false;
      } else {
        const prod = this.state.stationeryProducts.find((p) => p.id === item.productId);
        if (!prod || prod.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${item.name}`);
        }
        prod.stock -= item.quantity;
        if (prod.stock === 0) prod.isAvailable = false;
      }
    });

    const subtotal = storeItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
    const tax = Number((subtotal * 0.05).toFixed(2));
    const total = subtotal + tax;

    const randomId = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = storeType === 'food' ? `ORD-FDC-${randomId}` : `ORD-STN-${randomId}`;
    const qrToken = `token-${storeType}-${randomId}`;

    const newOrder: CampusOrder = {
      id: orderNumber,
      orderNumber,
      userId: this.state.currentUser.id,
      userName: this.state.currentUser.name,
      userRole: this.state.currentUser.role,
      storeType,
      items: storeItems,
      subtotal,
      tax,
      total,
      paymentStatus: 'completed',
      paymentMethod,
      transactionRef: `pay_${paymentMethod.toUpperCase()}_${Date.now()}`,
      orderStatus: 'confirmed',
      qrCodeData: `${orderNumber}::${qrToken}`,
      qrToken,
      createdAt: new Date().toISOString()
    };

    this.state.orders.unshift(newOrder);

    // Remove ordered store items from active cart
    this.state.cart = this.state.cart.filter((i) => i.storeType !== storeType);

    this.addNotification({
      userId: this.state.currentUser.id,
      title: `${storeType === 'food' ? 'Food Court' : 'Stationery'} Order Confirmed!`,
      message: `Order ${orderNumber} placed successfully. Show your QR receipt at the counter.`,
      type: 'success'
    });

    this.persist();
    return newOrder;
  }

  // QR Scanning & Validation for Staff Collection Counter
  public validateAndCollectOrder(qrTokenOrOrderNo: string): { success: boolean; message: string; order?: CampusOrder } {
    const staff = this.state.currentUser;

    const order = this.state.orders.find(
      (o) => o.qrToken === qrTokenOrOrderNo || o.orderNumber === qrTokenOrOrderNo || o.qrCodeData.includes(qrTokenOrOrderNo)
    );

    if (!order) {
      return { success: false, message: 'Invalid QR Code: No matching order found in campus records.' };
    }

    if (order.orderStatus === 'collected') {
      return {
        success: false,
        message: `REPEATED SCAN WARNING: Order ${order.orderNumber} was already collected on ${new Date(order.collectedAt!).toLocaleString()}.`,
        order
      };
    }

    if (order.orderStatus === 'cancelled') {
      return { success: false, message: `Order ${order.orderNumber} is cancelled and cannot be collected.`, order };
    }

    // Mark as collected
    order.orderStatus = 'collected';
    order.collectedAt = new Date().toISOString();
    order.collectedByStaffId = staff.id;

    this.addNotification({
      userId: order.userId,
      title: 'Order Items Collected!',
      message: `Your order ${order.orderNumber} has been handed over at the counter. Enjoy!`,
      type: 'info'
    });

    this.persist();
    return {
      success: true,
      message: `Order ${order.orderNumber} verified successfully! Hand over ${order.items.length} items to ${order.userName}.`,
      order
    };
  }

  // Manage Store Inventory
  public updateFoodProductStock(productId: string, newStock: number, isAvailable: boolean) {
    const p = this.state.foodProducts.find((item) => item.id === productId);
    if (p) {
      p.stock = newStock;
      p.isAvailable = isAvailable;
      this.persist();
    }
  }

  public updateStationeryProductStock(productId: string, newStock: number, isAvailable: boolean) {
    const p = this.state.stationeryProducts.find((item) => item.id === productId);
    if (p) {
      p.stock = newStock;
      p.isAvailable = isAvailable;
      this.persist();
    }
  }

  // ================= FEEDBACK & AUDIT =================
  public submitFeedback(feedback: { requestId: string; rating: number; timeSatisfaction: number; claritySatisfaction: number; easeOfUse: number; comments?: string }) {
    const newFb: ServiceFeedback = {
      id: `fb-${Date.now()}`,
      studentId: this.state.currentUser.id,
      studentName: this.state.currentUser.name,
      ...feedback,
      createdAt: new Date().toISOString()
    };
    this.state.feedbacks.unshift(newFb);
    this.persist();
  }

  public addAuditLog(log: { requestId?: string; actorId: string; actorName: string; actorRole: UserProfile['role']; action: string; details: string; previousStatus?: string; newStatus?: string }) {
    const event: AuditEvent = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ...log,
      timestamp: new Date().toISOString()
    };
    this.state.auditLogs.unshift(event);
  }

  public addNotification(n: { userId: string; title: string; message: string; type: AppNotification['type']; link?: string }) {
    const notif: AppNotification = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ...n,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    this.state.notifications.unshift(notif);
  }

  public markNotificationAsRead(id: string) {
    const notif = this.state.notifications.find((n) => n.id === id);
    if (notif) {
      notif.isRead = true;
      this.persist();
    }
  }
}

export const store = new StoreManager();
