-- ====================================================================
-- CAMPUSCONNECT: AI-POWERED STUDENT ADMINISTRATIVE PLATFORM SCHEMAS
-- Database Migration Script for PostgreSQL / Supabase
-- ====================================================================

-- 1. PROFILES & USER ROLES
CREATE TYPE user_role_type AS ENUM ('student', 'staff', 'hod', 'admin', 'food_staff', 'stationery_staff');

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    register_number VARCHAR(50) UNIQUE,
    employee_id VARCHAR(50) UNIQUE,
    role user_role_type NOT NULL DEFAULT 'student',
    department VARCHAR(100) NOT NULL,
    year_of_study INT,
    phone VARCHAR(20),
    parent_email VARCHAR(255),
    parent_phone VARCHAR(20),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. SERVICES & REQUIREMENTS
CREATE TABLE IF NOT EXISTS services (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    eligibility TEXT,
    required_fields JSONB NOT NULL DEFAULT '[]'::jsonb,
    required_documents JSONB NOT NULL DEFAULT '[]'::jsonb,
    target_days INT NOT NULL DEFAULT 3,
    requires_parent_verification BOOLEAN DEFAULT FALSE,
    requires_hod_approval BOOLEAN DEFAULT TRUE,
    department VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. PARENT VERIFICATION RECORDS
CREATE TABLE IF NOT EXISTS parent_verifications (
    id VARCHAR(50) PRIMARY KEY,
    application_id VARCHAR(50) NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    register_number VARCHAR(50) NOT NULL,
    service_title VARCHAR(255) NOT NULL,
    purpose TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    parent_contact VARCHAR(255) NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. APPLICATIONS & CERTIFICATE REQUESTS
CREATE TABLE IF NOT EXISTS applications (
    id VARCHAR(50) PRIMARY KEY,
    request_number VARCHAR(50) UNIQUE NOT NULL,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    student_name VARCHAR(255) NOT NULL,
    register_number VARCHAR(50) NOT NULL,
    department VARCHAR(100) NOT NULL,
    year_of_study INT NOT NULL,
    service_id VARCHAR(50) REFERENCES services(id),
    service_title VARCHAR(255) NOT NULL,
    purpose TEXT NOT NULL,
    form_data JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(50) NOT NULL DEFAULT 'submitted',
    current_stage VARCHAR(255) NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    target_completion_date TIMESTAMP WITH TIME ZONE,
    predicted_completion_date TIMESTAMP WITH TIME ZONE,
    confidence_score NUMERIC(3,2) DEFAULT 0.90,
    prediction_factors JSONB DEFAULT '[]'::jsonb,
    is_delayed BOOLEAN DEFAULT FALSE,
    delay_reason TEXT,
    parent_verification_id VARCHAR(50) REFERENCES parent_verifications(id),
    parent_verification_status VARCHAR(50) DEFAULT 'not_started',
    hod_approval_status VARCHAR(50) DEFAULT 'pending',
    hod_approved_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    issued_certificate_url TEXT
);

-- 5. ACADEMIC MONITORING & ALERTS
CREATE TABLE IF NOT EXISTS academic_records (
    id VARCHAR(50) PRIMARY KEY,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    student_name VARCHAR(255) NOT NULL,
    register_number VARCHAR(50) NOT NULL,
    department VARCHAR(100) NOT NULL,
    course_code VARCHAR(50) NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    total_classes INT NOT NULL,
    attended_classes INT NOT NULL,
    attendance_percentage NUMERIC(5,2) NOT NULL,
    internal_mark NUMERIC(5,2) NOT NULL,
    max_internal_mark NUMERIC(5,2) NOT NULL,
    normalized_mark_percentage NUMERIC(5,2) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS academic_thresholds (
    id VARCHAR(50) PRIMARY KEY,
    department VARCHAR(100) NOT NULL UNIQUE,
    min_attendance_percentage NUMERIC(5,2) DEFAULT 75.0,
    min_internal_mark_percentage NUMERIC(5,2) DEFAULT 50.0,
    internal_mark_scale NUMERIC(5,2) DEFAULT 25.0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS academic_alerts (
    id VARCHAR(50) PRIMARY KEY,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    student_name VARCHAR(255) NOT NULL,
    register_number VARCHAR(50) NOT NULL,
    department VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    course_code VARCHAR(50) NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    current_value NUMERIC(5,2) NOT NULL,
    threshold_value NUMERIC(5,2) NOT NULL,
    severity VARCHAR(20) DEFAULT 'warning',
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    guidance_text TEXT
);

-- 6. CAMPUS SHOPPING: FOOD COURT & STATIONERY
CREATE TABLE IF NOT EXISTS food_products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    stock INT DEFAULT 50,
    is_available BOOLEAN DEFAULT TRUE,
    preparation_time_minutes INT DEFAULT 10,
    image_url TEXT
);

CREATE TABLE IF NOT EXISTS stationery_products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    stock INT DEFAULT 50,
    is_available BOOLEAN DEFAULT TRUE,
    image_url TEXT
);

CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES profiles(id),
    user_name VARCHAR(255) NOT NULL,
    user_role user_role_type NOT NULL,
    store_type VARCHAR(20) NOT NULL,
    items JSONB NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL,
    tax NUMERIC(10,2) NOT NULL,
    total NUMERIC(10,2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending',
    payment_method VARCHAR(50) DEFAULT 'razorpay',
    transaction_ref VARCHAR(255),
    order_status VARCHAR(30) DEFAULT 'confirmed',
    qr_code_data TEXT NOT NULL,
    qr_token VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    collected_at TIMESTAMP WITH TIME ZONE,
    collected_by_staff_id UUID REFERENCES profiles(id)
);

-- 7. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(50) PRIMARY KEY,
    request_id VARCHAR(50),
    actor_id VARCHAR(100) NOT NULL,
    actor_name VARCHAR(255) NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    action VARCHAR(255) NOT NULL,
    details TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    previous_status VARCHAR(50),
    new_status VARCHAR(50)
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Students can view own applications" ON applications FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Staff can view all department applications" ON applications FOR SELECT USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('staff', 'hod', 'admin')
));
