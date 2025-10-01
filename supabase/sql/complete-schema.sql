
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 01. Users Profile Table
CREATE TABLE users_profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    nim_nip VARCHAR(20) UNIQUE, -- NIM for students, NIP for staff
    phone VARCHAR(20),
    avatar_url TEXT,
    birth_date DATE,
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 02. Roles Table
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_code VARCHAR(20) UNIQUE NOT NULL, -- ADMIN, DOSEN, MAHASISWA, LABORAN
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default roles
INSERT INTO roles (role_name, role_code, description) VALUES
('Administrator', 'ADMIN', 'Full system access and management'),
('Dosen', 'DOSEN', 'Teaching staff with course and quiz management'),
('Mahasiswa', 'MAHASISWA', 'Students with learning access'),
('Laboran', 'LABORAN', 'Laboratory staff with equipment management');

-- 03. Permissions Table
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    permission_name VARCHAR(100) NOT NULL,
    permission_code VARCHAR(50) UNIQUE NOT NULL,
    module VARCHAR(50) NOT NULL, -- user, course, quiz, booking, inventory
    action VARCHAR(20) NOT NULL, -- create, read, update, delete, approve
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert permissions
INSERT INTO permissions (permission_name, permission_code, module, action, description) VALUES
-- User management
('Create Users', 'user:create', 'user', 'create', 'Create new users'),
('View Users', 'user:read', 'user', 'read', 'View user information'),
('Update Users', 'user:update', 'user', 'update', 'Update user information'),
('Delete Users', 'user:delete', 'user', 'delete', 'Delete users'),

-- Course management
('Create Courses', 'course:create', 'course', 'create', 'Create new courses'),
('View Courses', 'course:read', 'course', 'read', 'View course information'),
('Update Courses', 'course:update', 'course', 'update', 'Update course information'),
('Delete Courses', 'course:delete', 'course', 'delete', 'Delete courses'),

-- Quiz management
('Create Quiz', 'quiz:create', 'quiz', 'create', 'Create new quizzes'),
('View Quiz', 'quiz:read', 'quiz', 'read', 'View quiz information'),
('Grade Quiz', 'quiz:grade', 'quiz', 'update', 'Grade quiz attempts'),
('Delete Quiz', 'quiz:delete', 'quiz', 'delete', 'Delete quizzes'),

-- Booking management
('Create Booking', 'booking:create', 'booking', 'create', 'Create lab/equipment bookings'),
('View Booking', 'booking:read', 'booking', 'read', 'View booking information'),
('Approve Booking', 'booking:approve', 'booking', 'approve', 'Approve booking requests'),
('Cancel Booking', 'booking:cancel', 'booking', 'delete', 'Cancel bookings'),

-- Inventory management
('Manage Inventory', 'inventory:manage', 'inventory', 'create', 'Full inventory management'),
('View Inventory', 'inventory:read', 'inventory', 'read', 'View inventory information'),
('Update Equipment', 'equipment:update', 'inventory', 'update', 'Update equipment status');

-- 04. User Roles Junction Table
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users_profile(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT NOW(),
    assigned_by UUID REFERENCES users_profile(id),
    is_active BOOLEAN DEFAULT true,
    UNIQUE(user_id, role_id)
);

-- 05. Role Permissions Junction Table
CREATE TABLE role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    granted_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(role_id, permission_id)
);

-- =============================================
-- PHASE 2: Laboratory & Equipment (Enhanced from your data)
-- =============================================

-- 06. Laboratories Table (Enhanced from your existing)
CREATE TABLE laboratories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lab_code VARCHAR(10) UNIQUE NOT NULL,
    lab_name VARCHAR(100) NOT NULL,
    lab_type VARCHAR(50) NOT NULL, -- 'praktikum' or 'depo_alat'
    description TEXT,
    capacity INTEGER DEFAULT 0,
    location VARCHAR(100),
    facilities TEXT[],
    operating_hours JSONB, -- {"monday": {"start": "08:00", "end": "17:00"}}
    contact_person VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert laboratories (from your data + enhancements)
INSERT INTO laboratories (lab_code, lab_name, lab_type, description, capacity, location, facilities, operating_hours) VALUES
('LAB001', 'Lab Keterampilan Dasar Praktik Kebidanan', 'praktikum', 'Laboratorium untuk praktik keterampilan dasar kebidanan', 25, 'Lantai 2, Ruang 201', 
 ARRAY['Phantom', 'Meja praktikum', 'Wastafel', 'AC'], 
 '{"monday": {"start": "08:00", "end": "17:00"}, "tuesday": {"start": "08:00", "end": "17:00"}, "wednesday": {"start": "08:00", "end": "17:00"}, "thursday": {"start": "08:00", "end": "17:00"}, "friday": {"start": "08:00", "end": "17:00"}}'::jsonb),

('LAB002', 'Lab ANC (Antenatal Care)', 'praktikum', 'Laboratorium khusus untuk praktik antenatal care', 20, 'Lantai 2, Ruang 202', 
 ARRAY['USG Simulator', 'Phantom hamil', 'Doppler', 'Timbangan'], 
 '{"monday": {"start": "08:00", "end": "17:00"}, "tuesday": {"start": "08:00", "end": "17:00"}, "wednesday": {"start": "08:00", "end": "17:00"}, "thursday": {"start": "08:00", "end": "17:00"}, "friday": {"start": "08:00", "end": "17:00"}}'::jsonb),

('LAB003', 'Lab PNC (Postnatal Care)', 'praktikum', 'Laboratorium untuk praktik postnatal care', 20, 'Lantai 2, Ruang 203', 
 ARRAY['Phantom ibu nifas', 'Alat pemeriksaan', 'Tempat tidur pasien'], 
 '{"monday": {"start": "08:00", "end": "17:00"}, "tuesday": {"start": "08:00", "end": "17:00"}, "wednesday": {"start": "08:00", "end": "17:00"}, "thursday": {"start": "08:00", "end": "17:00"}, "friday": {"start": "08:00", "end": "17:00"}}'::jsonb),

('LAB004', 'Lab INC (Intranatal Care)', 'praktikum', 'Laboratorium untuk praktik intranatal care', 20, 'Lantai 2, Ruang 204', 
 ARRAY['Phantom persalinan', 'Partus set', 'CTG simulator'], 
 '{"monday": {"start": "08:00", "end": "17:00"}, "tuesday": {"start": "08:00", "end": "17:00"}, "wednesday": {"start": "08:00", "end": "17:00"}, "thursday": {"start": "08:00", "end": "17:00"}, "friday": {"start": "08:00", "end": "17:00"}}'::jsonb),

('LAB005', 'Lab BBL (Bayi Baru Lahir)', 'praktikum', 'Laboratorium khusus perawatan bayi baru lahir', 15, 'Lantai 2, Ruang 205', 
 ARRAY['Phantom bayi', 'Inkubator', 'Resusitasi bayi'], 
 '{"monday": {"start": "08:00", "end": "17:00"}, "tuesday": {"start": "08:00", "end": "17:00"}, "wednesday": {"start": "08:00", "end": "17:00"}, "thursday": {"start": "08:00", "end": "17:00"}, "friday": {"start": "08:00", "end": "17:00"}}'::jsonb),

('LAB006', 'Lab Pelayanan KB', 'praktikum', 'Laboratorium untuk praktik pelayanan keluarga berencana', 20, 'Lantai 3, Ruang 301', 
 ARRAY['Phantom KB', 'Alat kontrasepsi', 'Model anatomis'], 
 '{"monday": {"start": "08:00", "end": "17:00"}, "tuesday": {"start": "08:00", "end": "17:00"}, "wednesday": {"start": "08:00", "end": "17:00"}, "thursday": {"start": "08:00", "end": "17:00"}, "friday": {"start": "08:00", "end": "17:00"}}'::jsonb),

('LAB007', 'Lab Konseling & Pendidikan Kesehatan', 'praktikum', 'Laboratorium untuk praktik konseling dan edukasi', 30, 'Lantai 3, Ruang 302', 
 ARRAY['Kursi konseling', 'Media edukasi', 'Proyektor'], 
 '{"monday": {"start": "08:00", "end": "17:00"}, "tuesday": {"start": "08:00", "end": "17:00"}, "wednesday": {"start": "08:00", "end": "17:00"}, "thursday": {"start": "08:00", "end": "17:00"}, "friday": {"start": "08:00", "end": "17:00"}}'::jsonb),

('LAB008', 'Lab Kebidanan Komunitas', 'praktikum', 'Laboratorium untuk praktik kebidanan komunitas', 25, 'Lantai 3, Ruang 303', 
 ARRAY['Peralatan survei', 'Tas bidan', 'Alat promkes'], 
 '{"monday": {"start": "08:00", "end": "17:00"}, "tuesday": {"start": "08:00", "end": "17:00"}, "wednesday": {"start": "08:00", "end": "17:00"}, "thursday": {"start": "08:00", "end": "17:00"}, "friday": {"start": "08:00", "end": "17:00"}}'::jsonb),

('LAB009', 'Lab Bayi, Balita, Anak Prasekolah', 'praktikum', 'Laboratorium perawatan anak', 20, 'Lantai 3, Ruang 304', 
 ARRAY['Phantom anak', 'Timbangan bayi', 'Alat pengukur tinggi'], 
 '{"monday": {"start": "08:00", "end": "17:00"}, "tuesday": {"start": "08:00", "end": "17:00"}, "wednesday": {"start": "08:00", "end": "17:00"}, "thursday": {"start": "08:00", "end": "17:00"}, "friday": {"start": "08:00", "end": "17:00"}}'::jsonb),

('DEP001', 'Ruangan Depo Alat', 'depo_alat', 'Pusat penyimpanan semua peralatan laboratorium', 0, 'Lantai 1, Ruang 101', 
 ARRAY['Rak penyimpanan', 'Sistem inventory', 'Kontrol suhu'], 
 '{"monday": {"start": "07:00", "end": "18:00"}, "tuesday": {"start": "07:00", "end": "18:00"}, "wednesday": {"start": "07:00", "end": "18:00"}, "thursday": {"start": "07:00", "end": "18:00"}, "friday": {"start": "07:00", "end": "18:00"}}'::jsonb);

-- 07. Equipments Table (Enhanced from your existing)
CREATE TABLE equipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipment_code VARCHAR(20) UNIQUE NOT NULL,
    equipment_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    subcategory VARCHAR(50),
    laboratory_id UUID REFERENCES laboratories(id), -- Home lab
    current_location_id UUID REFERENCES laboratories(id), -- Current location
    brand VARCHAR(50),
    model VARCHAR(50),
    serial_number VARCHAR(50),
    purchase_date DATE,
    purchase_price DECIMAL(12,2),
    warranty_end_date DATE,
    condition VARCHAR(20) DEFAULT 'good', -- 'excellent', 'good', 'fair', 'poor', 'broken'
    status VARCHAR(20) DEFAULT 'available', -- 'available', 'in_use', 'maintenance', 'broken', 'retired'
    description TEXT,
    specifications JSONB,
    maintenance_notes TEXT,
    last_maintenance DATE,
    next_maintenance DATE,
    qr_code VARCHAR(100), -- For QR code tracking
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert equipments (Enhanced from your existing data)
INSERT INTO equipments (equipment_code, equipment_name, category, subcategory, laboratory_id, current_location_id, condition, status, specifications) VALUES
-- Lab Keterampilan Dasar
('EQ001', 'Phantom Ibu Hamil Lengkap', 'phantom', 'maternity', 
 (SELECT id FROM laboratories WHERE lab_code = 'LAB001'), (SELECT id FROM laboratories WHERE lab_code = 'DEP001'), 
 'good', 'available', '{"material": "silicone", "size": "adult", "features": ["palpation", "leopold_maneuver"]}'::jsonb),
('EQ002', 'Stetoskop Obstetri Pinard', 'medical_device', 'diagnostic', 
 (SELECT id FROM laboratories WHERE lab_code = 'LAB001'), (SELECT id FROM laboratories WHERE lab_code = 'DEP001'), 
 'good', 'available', '{"type": "pinard", "material": "wood"}'::jsonb),
('EQ003', 'Tensimeter Manual Aneroid', 'medical_device', 'diagnostic', 
 (SELECT id FROM laboratories WHERE lab_code = 'LAB001'), (SELECT id FROM laboratories WHERE lab_code = 'DEP001'), 
 'good', 'available', '{"type": "aneroid", "cuff_size": "adult"}'::jsonb),

-- Lab ANC
('EQ004', 'USG Simulator untuk Training', 'medical_device', 'imaging', 
 (SELECT id FROM laboratories WHERE lab_code = 'LAB002'), (SELECT id FROM laboratories WHERE lab_code = 'LAB002'), 
 'excellent', 'available', '{"type": "training", "presets": ["fetal_growth", "anomaly_detection"]}'::jsonb),
('EQ005', 'Doppler Fetal Handheld', 'medical_device', 'diagnostic', 
 (SELECT id FROM laboratories WHERE lab_code = 'LAB002'), (SELECT id FROM laboratories WHERE lab_code = 'DEP001'), 
 'good', 'available', '{"frequency": "3MHz", "battery": "rechargeable"}'::jsonb),
('EQ006', 'Phantom Pemeriksaan ANC', 'phantom', 'antenatal', 
 (SELECT id FROM laboratories WHERE lab_code = 'LAB002'), (SELECT id FROM laboratories WHERE lab_code = 'LAB002'), 
 'good', 'available', '{"gestational_stages": ["first_trimester", "second_trimester", "third_trimester"]}'::jsonb),

-- Lab PNC
('EQ007', 'Phantom Ibu Nifas dan Laktasi', 'phantom', 'postnatal', 
 (SELECT id FROM laboratories WHERE lab_code = 'LAB003'), (SELECT id FROM laboratories WHERE lab_code = 'LAB003'), 
 'good', 'available', '{"features": ["breast_examination", "lactation_counseling"]}'::jsonb),
('EQ008', 'Set Perawatan Nifas Lengkap', 'medical_device', 'treatment', 
 (SELECT id FROM laboratories WHERE lab_code = 'LAB003'), (SELECT id FROM laboratories WHERE lab_code = 'DEP001'), 
 'good', 'available', '{"contents": ["perineal_care", "breast_care", "wound_care"]}'::jsonb),

-- Lab INC
('EQ009', 'Phantom Persalinan Normal dan Patologis', 'phantom', 'intranatal', 
 (SELECT id FROM laboratories WHERE lab_code = 'LAB004'), (SELECT id FROM laboratories WHERE lab_code = 'LAB004'), 
 'good', 'available', '{"scenarios": ["normal_delivery", "breech", "shoulder_dystocia"]}'::jsonb),
('EQ010', 'Partus Set Steril Lengkap', 'medical_device', 'surgical', 
 (SELECT id FROM laboratories WHERE lab_code = 'LAB004'), (SELECT id FROM laboratories WHERE lab_code = 'DEP001'), 
 'good', 'available', '{"sterility": "gamma_sterilized", "single_use": true}'::jsonb),
('EQ011', 'CTG Simulator untuk Training', 'medical_device', 'monitoring', 
 (SELECT id FROM laboratories WHERE lab_code = 'LAB004'), (SELECT id FROM laboratories WHERE lab_code = 'LAB004'), 
 'good', 'available', '{"patterns": ["normal", "hypoxia", "variable_decel"]}'::jsonb),

-- Lab BBL
('EQ012', 'Phantom Bayi Baru Lahir Realistis', 'phantom', 'neonatal', 
 (SELECT id FROM laboratories WHERE lab_code = 'LAB005'), (SELECT id FROM laboratories WHERE lab_code = 'LAB005'), 
 'good', 'available', '{"weight": "3.2kg", "length": "50cm", "features": ["crying", "breathing"]}'::jsonb),
('EQ013', 'Inkubator Training Model', 'medical_device', 'neonatal_care', 
 (SELECT id FROM laboratories WHERE lab_code = 'LAB005'), (SELECT id FROM laboratories WHERE lab_code = 'LAB005'), 
 'good', 'available', '{"temperature_control": true, "humidity_control": true, "oxygen_monitoring": true}'::jsonb),
('EQ014', 'Set Resusitasi Bayi Lengkap', 'medical_device', 'emergency', 
 (SELECT id FROM laboratories WHERE lab_code = 'LAB005'), (SELECT id FROM laboratories WHERE lab_code = 'DEP001'), 
 'good', 'available', '{"contents": ["bag_mask", "laryngoscope", "endotracheal_tubes"]}'::jsonb),

-- Lab KB
('EQ015', 'Model Anatomi Alat Reproduksi', 'educational_model', 'anatomy', 
 (SELECT id FROM laboratories WHERE lab_code = 'LAB006'), (SELECT id FROM laboratories WHERE lab_code = 'LAB006'), 
 'good', 'available', '{"parts": ["ovaries", "fallopian_tubes", "uterus", "vagina"]}'::jsonb),
('EQ016', 'Phantom IUD Insertion Training', 'phantom', 'contraception', 
 (SELECT id FROM laboratories WHERE lab_code = 'LAB006'), (SELECT id FROM laboratories WHERE lab_code = 'DEP001'), 
 'good', 'available', '{"iud_types": ["copper", "hormonal"], "difficulty_levels": ["beginner", "advanced"]}'::jsonb),

-- Lab Konseling
('EQ017', 'Media Edukasi Flipchart Kesehatan', 'educational_material', 'counseling', 
 (SELECT id FROM laboratories WHERE lab_code = 'LAB007'), (SELECT id FROM laboratories WHERE lab_code = 'LAB007'), 
 'good', 'available', '{"topics": ["pregnancy", "breastfeeding", "family_planning", "child_health"]}'::jsonb),
('EQ018', 'Proyektor Digital HD', 'electronics', 'presentation', 
 (SELECT id FROM laboratories WHERE lab_code = 'LAB007'), (SELECT id FROM laboratories WHERE lab_code = 'LAB007'), 
 'good', 'available', '{"resolution": "1920x1080", "brightness": "3000_lumens", "connectivity": ["HDMI", "USB", "WiFi"]}'::jsonb),

-- Lab Komunitas
('EQ019', 'Tas Bidan Komunitas Lengkap', 'equipment_set', 'community_health', 
 (SELECT id FROM laboratories WHERE lab_code = 'LAB008'), (SELECT id FROM laboratories WHERE lab_code = 'DEP001'), 
 'good', 'available', '{"contents": ["basic_instruments", "medication", "documentation_forms"]}'::jsonb),
('EQ020', 'Peralatan Survei Kesehatan Masyarakat', 'equipment_set', 'survey', 
 (SELECT id FROM laboratories WHERE lab_code = 'LAB008'), (SELECT id FROM laboratories WHERE lab_code = 'DEP001'), 
 'good', 'available', '{"tools": ["questionnaires", "measurement_tools", "data_collection_forms"]}'::jsonb),

-- Lab Anak
('EQ021', 'Phantom Anak Usia 1-5 Tahun', 'phantom', 'pediatric', 
 (SELECT id FROM laboratories WHERE lab_code = 'LAB009'), (SELECT id FROM laboratories WHERE lab_code = 'LAB009'), 
 'good', 'available', '{"age_simulation": ["toddler", "preschool"], "procedures": ["vital_signs", "immunization"]}'::jsonb),
('EQ022', 'Timbangan Bayi Digital Akurat', 'medical_device', 'measurement', 
 (SELECT id FROM laboratories WHERE lab_code = 'LAB009'), (SELECT id FROM laboratories WHERE lab_code = 'DEP001'), 
 'good', 'available', '{"capacity": "20kg", "precision": "10g", "features": ["tare", "hold"]}'::jsonb),
('EQ023', 'Stadiometer Anak Portable', 'medical_device', 'measurement', 
 (SELECT id FROM laboratories WHERE lab_code = 'LAB009'), (SELECT id FROM laboratories WHERE lab_code = 'DEP001'), 
 'good', 'available', '{"range": "60-200cm", "precision": "1mm", "portable": true}'::jsonb);

-- =============================================
-- PHASE 3: Academic Management
-- =============================================

-- 08. Mata Kuliah Table
CREATE TABLE mata_kuliah (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_code VARCHAR(20) UNIQUE NOT NULL,
    course_name VARCHAR(100) NOT NULL,
    description TEXT,
    credit_hours INTEGER DEFAULT 0,
    theory_hours INTEGER DEFAULT 0,
    practice_hours INTEGER DEFAULT 0,
    semester INTEGER,
    prerequisite_course_id UUID REFERENCES mata_kuliah(id),
    suggested_laboratory_id UUID REFERENCES laboratories(id),
    created_by UUID REFERENCES users_profile(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert mata kuliah sesuai lab kebidanan
INSERT INTO mata_kuliah (course_code, course_name, description, credit_hours, theory_hours, practice_hours, semester, suggested_laboratory_id, is_active) VALUES
('AK101', 'Keterampilan Dasar Praktik Kebidanan', 'Pembelajaran keterampilan dasar praktik kebidanan', 3, 1, 2, 1, (SELECT id FROM laboratories WHERE lab_code = 'LAB001'), true),
('AK201', 'Asuhan Kehamilan (ANC)', 'Praktik asuhan antenatal care komprehensif', 4, 2, 2, 2, (SELECT id FROM laboratories WHERE lab_code = 'LAB002'), true),
('AK301', 'Asuhan Nifas (PNC)', 'Praktik asuhan postnatal care dan laktasi', 3, 1, 2, 3, (SELECT id FROM laboratories WHERE lab_code = 'LAB003'), true),
('AK401', 'Asuhan Persalinan (INC)', 'Praktik asuhan intranatal care normal dan patologis', 4, 2, 2, 4, (SELECT id FROM laboratories WHERE lab_code = 'LAB004'), true),
('AK501', 'Asuhan Bayi Baru Lahir', 'Perawatan komprehensif bayi baru lahir', 3, 1, 2, 5, (SELECT id FROM laboratories WHERE lab_code = 'LAB005'), true),
('KB101', 'Pelayanan Keluarga Berencana', 'Konseling dan pelayanan KB', 3, 2, 1, 4, (SELECT id FROM laboratories WHERE lab_code = 'LAB006'), true),
('KK101', 'Konseling dan Pendidikan Kesehatan', 'Teknik konseling dan edukasi kesehatan', 2, 1, 1, 3, (SELECT id FROM laboratories WHERE lab_code = 'LAB007'), true),
('KM101', 'Kebidanan Komunitas', 'Praktik kebidanan berbasis masyarakat', 3, 2, 1, 5, (SELECT id FROM laboratories WHERE lab_code = 'LAB008'), true),
('KA101', 'Kesehatan Anak dan Balita', 'Asuhan kesehatan anak komprehensif', 3, 1, 2, 4, (SELECT id FROM laboratories WHERE lab_code = 'LAB009'), true);

-- 09. Student Enrollments
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES users_profile(id) ON DELETE CASCADE,
    mata_kuliah_id UUID REFERENCES mata_kuliah(id) ON DELETE CASCADE,
    enrollment_date TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'active', -- active, completed, dropped, failed
    final_grade VARCHAR(5), -- A, B+, B, C+, C, D, E
    grade_points DECIMAL(3,2), -- 4.00, 3.67, etc.
    attendance_percentage DECIMAL(5,2),
    UNIQUE(student_id, mata_kuliah_id)
);

-- 10. Materi Table
CREATE TABLE materi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mata_kuliah_id UUID REFERENCES mata_kuliah(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    content_type VARCHAR(50), -- pdf, video, document, link
    file_url TEXT,
    file_size BIGINT, -- in bytes
    upload_by UUID REFERENCES users_profile(id),
    is_downloadable BOOLEAN DEFAULT true,
    is_required BOOLEAN DEFAULT false,
    order_number INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- PHASE 4: Quiz System (Complex)
-- =============================================

-- 11. Kuis Table
CREATE TABLE kuis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mata_kuliah_id UUID REFERENCES mata_kuliah(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    instructions TEXT,
    quiz_type VARCHAR(50) DEFAULT 'practice', -- practice, midterm, final, assignment
    total_questions INTEGER DEFAULT 0,
    time_limit INTEGER, -- in minutes
    max_attempts INTEGER DEFAULT 1,
    passing_score DECIMAL(5,2) DEFAULT 70.00,
    randomize_questions BOOLEAN DEFAULT false,
    randomize_options BOOLEAN DEFAULT false,
    show_results_immediately BOOLEAN DEFAULT true,
    allow_review BOOLEAN DEFAULT true,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_by UUID REFERENCES users_profile(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 12. Kuis Questions
CREATE TABLE kuis_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kuis_id UUID REFERENCES kuis(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL, -- multiple_choice, true_false, short_answer, essay, matching
    question_image_url TEXT,
    points DECIMAL(5,2) DEFAULT 1.00,
    explanation TEXT,
    order_number INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 13. Question Options (for multiple choice questions)
CREATE TABLE question_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID REFERENCES kuis_questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    option_image_url TEXT,
    is_correct BOOLEAN DEFAULT false,
    order_number INTEGER DEFAULT 0
);

-- 14. Kuis Attempts
CREATE TABLE kuis_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kuis_id UUID REFERENCES kuis(id) ON DELETE CASCADE,
    student_id UUID REFERENCES users_profile(id) ON DELETE CASCADE,
    attempt_number INTEGER DEFAULT 1,
    start_time TIMESTAMP DEFAULT NOW(),
    end_time TIMESTAMP,
    time_spent INTEGER, -- in seconds
    total_score DECIMAL(5,2),
    percentage_score DECIMAL(5,2),
    status VARCHAR(20) DEFAULT 'in_progress', -- in_progress, completed, abandoned, graded
    graded_by UUID REFERENCES users_profile(id),
    graded_at TIMESTAMP,
    feedback TEXT,
    UNIQUE(kuis_id, student_id, attempt_number)
);

-- 15. Kuis Answers
CREATE TABLE kuis_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID REFERENCES kuis_attempts(id) ON DELETE CASCADE,
    question_id UUID REFERENCES kuis_questions(id) ON DELETE CASCADE,
    selected_option_id UUID REFERENCES question_options(id),
    text_answer TEXT, -- for short answer and essay questions
    is_correct BOOLEAN,
    points_earned DECIMAL(5,2) DEFAULT 0,
    answered_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- PHASE 5: Scheduling & Booking System
-- =============================================

-- 16. Jadwal Table
CREATE TABLE jadwal (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mata_kuliah_id UUID REFERENCES mata_kuliah(id) ON DELETE CASCADE,
    laboratory_id UUID REFERENCES laboratories(id),
    dosen_id UUID REFERENCES users_profile(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    scheduled_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    session_type VARCHAR(50) DEFAULT 'practice', -- lecture, practice, exam, consultation
    recurring_type VARCHAR(20), -- none, weekly, monthly
    recurring_until DATE,
    status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, ongoing, completed, cancelled
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 17. Peminjaman Table (Equipment/Lab Booking Requests)
CREATE TABLE peminjaman (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requested_by UUID REFERENCES users_profile(id) ON DELETE CASCADE,
    mata_kuliah_id UUID REFERENCES mata_kuliah(id),
    laboratory_id UUID REFERENCES laboratories(id),
    request_title VARCHAR(200) NOT NULL,
    purpose TEXT NOT NULL,
    requested_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    participant_count INTEGER,
    equipment_needed TEXT[], -- Array of equipment names/codes
    special_requirements TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, cancelled, completed
    approved_by UUID REFERENCES users_profile(id),
    approved_at TIMESTAMP,
    approval_notes TEXT,
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 18. Booking Table (Approved Bookings)
CREATE TABLE booking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    peminjaman_id UUID REFERENCES peminjaman(id) ON DELETE CASCADE,
    laboratory_id UUID REFERENCES laboratories(id),
    booked_by UUID REFERENCES users_profile(id),
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    actual_start_time TIMESTAMP,
    actual_end_time TIMESTAMP,
    participant_count INTEGER,
    status VARCHAR(20) DEFAULT 'confirmed', -- confirmed, in_use, completed, cancelled
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 19. Equipment Bookings (Specific Equipment Reservations)
CREATE TABLE equipment_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES booking(id) ON DELETE CASCADE,
    equipment_id UUID REFERENCES equipments(id),
    quantity_requested INTEGER DEFAULT 1,
    quantity_allocated INTEGER DEFAULT 0,
    pickup_time TIMESTAMP,
    return_time TIMESTAMP,
    condition_before VARCHAR(20), -- condition when picked up
    condition_after VARCHAR(20), -- condition when returned
    damage_notes TEXT,
    responsible_person UUID REFERENCES users_profile(id)
);

-- =============================================
-- PHASE 6: Inventory & Asset Management
-- =============================================

-- 20. Inventaris Table (Inventory Tracking)
CREATE TABLE inventaris (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipment_id UUID REFERENCES equipments(id) ON DELETE CASCADE,
    stock_quantity INTEGER DEFAULT 1,
    available_quantity INTEGER DEFAULT 1,
    reserved_quantity INTEGER DEFAULT 0,
    minimum_stock INTEGER DEFAULT 1,
    reorder_point INTEGER DEFAULT 1,
    last_stock_check DATE,
    stock_check_by UUID REFERENCES users_profile(id),
    location_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 21. Stock Movements (Inventory Movement Tracking)
CREATE TABLE stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipment_id UUID REFERENCES equipments(id) ON DELETE CASCADE,
    movement_type VARCHAR(20) NOT NULL, -- in, out, transfer, adjustment, maintenance
    quantity INTEGER NOT NULL,
    from_location_id UUID REFERENCES laboratories(id),
    to_location_id UUID REFERENCES laboratories(id),
    reference_id UUID, -- Can reference booking_id or maintenance_id
    reference_type VARCHAR(50), -- booking, maintenance, adjustment, purchase
    notes TEXT,
    moved_by UUID REFERENCES users_profile(id),
    movement_date TIMESTAMP DEFAULT NOW()
);

-- 22. Equipment Maintenance
CREATE TABLE equipment_maintenance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipment_id UUID REFERENCES equipments(id) ON DELETE CASCADE,
    maintenance_type VARCHAR(50) NOT NULL, -- preventive, corrective, calibration, inspection
    scheduled_date DATE NOT NULL,
    completed_date DATE,
    maintenance_description TEXT,
    cost DECIMAL(12,2),
    vendor VARCHAR(100),
    technician VARCHAR(100),
    maintenance_notes TEXT,
    next_maintenance_date DATE,
    status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, in_progress, completed, cancelled
    created_by UUID REFERENCES users_profile(id),
    completed_by UUID REFERENCES users_profile(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- PHASE 7: Notifications & Communication
-- =============================================

-- 23. Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users_profile(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- info, warning, error, success, booking, quiz, maintenance
    priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
    related_table VARCHAR(50), -- table name that triggered notification
    related_id UUID, -- ID of related record
    is_read BOOLEAN DEFAULT false,
    is_push_sent BOOLEAN DEFAULT false,
    is_email_sent BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 24. Pengumuman (Announcements)
CREATE TABLE pengumuman (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    announcement_type VARCHAR(50) DEFAULT 'general', -- general, urgent, maintenance, academic
    target_roles VARCHAR(50)[], -- Array of role codes: ['MAHASISWA', 'DOSEN']
    target_courses UUID[], -- Array of mata_kuliah IDs for course-specific announcements
    is_active BOOLEAN DEFAULT true,
    publish_date TIMESTAMP DEFAULT NOW(),
    expire_date TIMESTAMP,
    created_by UUID REFERENCES users_profile(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- PHASE 8: Grading & Assessment
-- =============================================

-- 25. Nilai (Grades)
CREATE TABLE nilai (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES users_profile(id) ON DELETE CASCADE,
    mata_kuliah_id UUID REFERENCES mata_kuliah(id) ON DELETE CASCADE,
    assessment_type VARCHAR(50) NOT NULL, -- quiz, midterm, final, assignment, practice
    assessment_title VARCHAR(200),
    kuis_attempt_id UUID REFERENCES kuis_attempts(id), -- If grade is from quiz
    raw_score DECIMAL(5,2),
    max_score DECIMAL(5,2),
    percentage DECIMAL(5,2),
    letter_grade VARCHAR(5), -- A, B+, B, C+, C, D, E
    grade_points DECIMAL(3,2), -- 4.00, 3.67, etc.
    weight DECIMAL(3,2) DEFAULT 1.00, -- Weight in final grade calculation
    graded_by UUID REFERENCES users_profile(id),
    graded_at TIMESTAMP DEFAULT NOW(),
    feedback TEXT,
    is_final BOOLEAN DEFAULT false
);

-- =============================================
-- PHASE 9: System Logging & Auditing
-- =============================================

-- 26. Audit Logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users_profile(id),
    action VARCHAR(100) NOT NULL, -- CREATE, UPDATE, DELETE, LOGIN, LOGOUT, etc.
    table_name VARCHAR(50) NOT NULL,
    record_id UUID,
    old_values JSONB, -- Before update values
    new_values JSONB, -- After update values
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(100),
    timestamp TIMESTAMP DEFAULT NOW()
);

-- 27. System Settings
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(20) DEFAULT 'string', -- string, number, boolean, json
    description TEXT,
    is_public BOOLEAN DEFAULT false, -- Can be accessed by non-admin users
    updated_by UUID REFERENCES users_profile(id),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('app_name', 'Sistem Praktikum Kebidanan', 'string', 'Application name', true),
('app_version', '1.0.0', 'string', 'Current application version', true),
('maintenance_mode', 'false', 'boolean', 'Enable/disable maintenance mode', false),
('max_file_upload_size', '50', 'number', 'Maximum file upload size in MB', false),
('session_timeout', '8', 'number', 'Session timeout in hours', false),
('backup_retention_days', '30', 'number', 'How many days to keep backups', false),
('quiz_auto_save_interval', '30', 'number', 'Auto-save interval for quiz attempts in seconds', true),
('notification_retention_days', '90', 'number', 'How many days to keep notifications', false);

-- =============================================
-- INDEXES for Performance Optimization
-- =============================================

-- Users and Authentication
CREATE INDEX idx_users_email ON users_profile(email);
CREATE INDEX idx_users_nim_nip ON users_profile(nim_nip);
CREATE INDEX idx_users_active ON users_profile(is_active);
CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role_id);

-- Laboratories and Equipment
CREATE INDEX idx_laboratories_type ON laboratories(lab_type);
CREATE INDEX idx_laboratories_active ON laboratories(is_active);
CREATE INDEX idx_equipments_status ON equipments(status);
CREATE INDEX idx_equipments_condition ON equipments(condition);
CREATE INDEX idx_equipments_current_location ON equipments(current_location_id);
CREATE INDEX idx_equipments_laboratory ON equipments(laboratory_id);
CREATE INDEX idx_equipments_category ON equipments(category);

-- Academic
CREATE INDEX idx_mata_kuliah_active ON mata_kuliah(is_active);
CREATE INDEX idx_mata_kuliah_semester ON mata_kuliah(semester);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(mata_kuliah_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);
CREATE INDEX idx_materi_course ON materi(mata_kuliah_id);

-- Quiz System
CREATE INDEX idx_kuis_course ON kuis(mata_kuliah_id);
CREATE INDEX idx_kuis_active ON kuis(is_active);
CREATE INDEX idx_kuis_date_range ON kuis(start_date, end_date);
CREATE INDEX idx_kuis_questions_kuis ON kuis_questions(kuis_id);
CREATE INDEX idx_kuis_attempts_kuis ON kuis_attempts(kuis_id);
CREATE INDEX idx_kuis_attempts_student ON kuis_attempts(student_id);
CREATE INDEX idx_kuis_attempts_status ON kuis_attempts(status);
CREATE INDEX idx_kuis_answers_attempt ON kuis_answers(attempt_id);

-- Booking System
CREATE INDEX idx_jadwal_date ON jadwal(scheduled_date);
CREATE INDEX idx_jadwal_laboratory ON jadwal(laboratory_id);
CREATE INDEX idx_jadwal_dosen ON jadwal(dosen_id);
CREATE INDEX idx_peminjaman_status ON peminjaman(status);
CREATE INDEX idx_peminjaman_date ON peminjaman(requested_date);
CREATE INDEX idx_peminjaman_requester ON peminjaman(requested_by);
CREATE INDEX idx_booking_date ON booking(booking_date);
CREATE INDEX idx_booking_laboratory ON booking(laboratory_id);
CREATE INDEX idx_booking_status ON booking(status);

-- Inventory
CREATE INDEX idx_inventaris_equipment ON inventaris(equipment_id);
CREATE INDEX idx_stock_movements_equipment ON stock_movements(equipment_id);
CREATE INDEX idx_stock_movements_date ON stock_movements(movement_date);
CREATE INDEX idx_equipment_maintenance_equipment ON equipment_maintenance(equipment_id);
CREATE INDEX idx_equipment_maintenance_date ON equipment_maintenance(scheduled_date);
CREATE INDEX idx_equipment_maintenance_status ON equipment_maintenance(status);

-- Notifications and Communication
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created ON notifications(created_at);
CREATE INDEX idx_pengumuman_active ON pengumuman(is_active);
CREATE INDEX idx_pengumuman_publish ON pengumuman(publish_date);

-- Grading
CREATE INDEX idx_nilai_student ON nilai(student_id);
CREATE INDEX idx_nilai_course ON nilai(mata_kuliah_id);
CREATE INDEX idx_nilai_type ON nilai(assessment_type);
CREATE INDEX idx_nilai_graded_at ON nilai(graded_at);

-- System
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_table ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all sensitive tables
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE mata_kuliah ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE materi ENABLE ROW LEVEL SECURITY;
ALTER TABLE kuis ENABLE ROW LEVEL SECURITY;
ALTER TABLE kuis_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE kuis_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE jadwal ENABLE ROW LEVEL SECURITY;
ALTER TABLE peminjaman ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking ENABLE ROW LEVEL SECURITY;
ALTER TABLE nilai ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile and public profiles
CREATE POLICY "Users can view own profile" ON users_profile
    FOR SELECT USING (id = auth.uid() OR is_active = true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users_profile
    FOR UPDATE USING (id = auth.uid());

-- Dosen can manage their own courses
CREATE POLICY "Dosen can manage own courses" ON mata_kuliah
    FOR ALL USING (
        created_by = auth.uid() OR 
        EXISTS (SELECT 1 FROM user_roles ur JOIN roles r ON ur.role_id = r.id 
                WHERE ur.user_id = auth.uid() AND r.role_code = 'ADMIN')
    );

-- Students can view enrolled courses
CREATE POLICY "Students can view enrolled courses" ON mata_kuliah
    FOR SELECT USING (
        is_active = true AND (
            EXISTS (SELECT 1 FROM enrollments e WHERE e.mata_kuliah_id = id AND e.student_id = auth.uid()) OR
            EXISTS (SELECT 1 FROM user_roles ur JOIN roles r ON ur.role_id = r.id 
                    WHERE ur.user_id = auth.uid() AND r.role_code IN ('ADMIN', 'DOSEN'))
        )
    );

-- Students can only see their own quiz attempts
CREATE POLICY "Students can view own quiz attempts" ON kuis_attempts
    FOR SELECT USING (
        student_id = auth.uid() OR
        EXISTS (SELECT 1 FROM user_roles ur JOIN roles r ON ur.role_id = r.id 
                WHERE ur.user_id = auth.uid() AND r.role_code IN ('ADMIN', 'DOSEN'))
    );

-- Users can only see their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (user_id = auth.uid());

-- Dosen and above can view audit logs
CREATE POLICY "Authorized users can view audit logs" ON audit_logs
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM user_roles ur JOIN roles r ON ur.role_id = r.id 
                WHERE ur.user_id = auth.uid() AND r.role_code IN ('ADMIN', 'DOSEN'))
    );

-- =============================================
-- DATABASE FUNCTIONS & TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Apply timestamp trigger to relevant tables
CREATE TRIGGER update_users_profile_updated_at
    BEFORE UPDATE ON users_profile
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_laboratories_updated_at
    BEFORE UPDATE ON laboratories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_equipments_updated_at
    BEFORE UPDATE ON equipments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_mata_kuliah_updated_at
    BEFORE UPDATE ON mata_kuliah
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_materi_updated_at
    BEFORE UPDATE ON materi
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to create audit log entries
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER AS $
BEGIN
    INSERT INTO audit_logs (user_id, action, table_name, record_id, old_values, new_values)
    VALUES (
        auth.uid(),
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END
    );
    RETURN COALESCE(NEW, OLD);
END;
$ LANGUAGE plpgsql;

-- Apply audit triggers to sensitive tables
CREATE TRIGGER audit_users_profile
    AFTER INSERT OR UPDATE OR DELETE ON users_profile
    FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_equipments
    AFTER INSERT OR UPDATE OR DELETE ON equipments
    FOR EACH ROW EXECUTE FUNCTION create_audit_log();

-- Function to calculate quiz scores
CREATE OR REPLACE FUNCTION calculate_quiz_score(attempt_id_param UUID)
RETURNS DECIMAL(5,2) AS $
DECLARE
    total_points DECIMAL(5,2);
    earned_points DECIMAL(5,2);
    percentage DECIMAL(5,2);
BEGIN
    -- Calculate total possible points
    SELECT COALESCE(SUM(kq.points), 0) INTO total_points
    FROM kuis_attempts ka
    JOIN kuis k ON ka.kuis_id = k.id
    JOIN kuis_questions kq ON k.id = kq.kuis_id
    WHERE ka.id = attempt_id_param;
    
    -- Calculate earned points
    SELECT COALESCE(SUM(ans.points_earned), 0) INTO earned_points
    FROM kuis_answers ans
    WHERE ans.attempt_id = attempt_id_param;
    
    -- Calculate percentage
    IF total_points > 0 THEN
        percentage := (earned_points / total_points) * 100;
    ELSE
        percentage := 0;
    END IF;
    
    -- Update the attempt record
    UPDATE kuis_attempts 
    SET total_score = earned_points, 
        percentage_score = percentage
    WHERE id = attempt_id_param;
    
    RETURN percentage;
END;
$ LANGUAGE plpgsql;

-- =============================================
-- INITIAL ADMIN USER SETUP
-- =============================================

-- Insert initial admin user (password should be changed immediately)
INSERT INTO users_profile (id, email, username, full_name, nim_nip, is_active, email_verified)
VALUES (
    gen_random_uuid(),
    'admin@akbidmegabuana.ac.id',
    'admin',
    'System Administrator',
    'ADM001',
    true,
    true
);

-- Assign admin role to initial user
INSERT INTO user_roles (user_id, role_id)
SELECT 
    up.id,
    r.id
FROM users_profile up, roles r
WHERE up.email = 'admin@akbidmegabuana.ac.id'
AND r.role_code = 'ADMIN';

-- Grant all permissions to admin role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.role_code = 'ADMIN';

-- =============================================
-- SAMPLE DATA FOR TESTING
-- =============================================

-- Insert sample dosen
INSERT INTO users_profile (email, username, full_name, nim_nip, is_active, email_verified)
VALUES 
('dosen1@akbidmegabuana.ac.id', 'dosen1', 'Dr. Siti Aminah, S.ST., M.Kes', 'DOS001', true, true),
('dosen2@akbidmegabuana.ac.id', 'dosen2', 'Ns. Budi Hartono, S.Kep., M.Keb', 'DOS002', true, true);

-- Assign dosen roles
INSERT INTO user_roles (user_id, role_id)
SELECT up.id, r.id
FROM users_profile up, roles r
WHERE up.email IN ('dosen1@akbidmegabuana.ac.id', 'dosen2@akbidmegabuana.ac.id')
AND r.role_code = 'DOSEN';

-- Insert sample students
INSERT INTO users_profile (email, username, full_name, nim_nip, is_active, email_verified)
VALUES 
('mhs1@akbidmegabuana.ac.id', 'mhs1', 'Andi Putri Sari', '2024001', true, true),
('mhs2@akbidmegabuana.ac.id', 'mhs2', 'Dewi Kusuma Wardani', '2024002', true, true),
('mhs3@akbidmegabuana.ac.id', 'mhs3', 'Fitria Rahmawati', '2024003', true, true);

-- Assign student roles
INSERT INTO user_roles (user_id, role_id)
SELECT up.id, r.id
FROM users_profile up, roles r
WHERE up.email LIKE 'mhs%@akbidmegabuana.ac.id'
AND r.role_code = 'MAHASISWA';

-- Insert sample laboran
INSERT INTO users_profile (email, username, full_name, nim_nip, is_active, email_verified)
VALUES 
('laboran1@akbidmegabuana.ac.id', 'laboran1', 'Ahmad Fauzi, A.Md.Keb', 'LAB001', true, true);

-- Assign laboran role
INSERT INTO user_roles (user_id, role_id)
SELECT up.id, r.id
FROM users_profile up, roles r
WHERE up.email = 'laboran1@akbidmegabuana.ac.id'
AND r.role_code = 'LABORAN';

-- Update mata_kuliah with created_by
UPDATE mata_kuliah SET created_by = (
    SELECT id FROM users_profile WHERE email = 'dosen1@akbidmegabuana.ac.id' LIMIT 1
) WHERE course_code IN ('AK101', 'AK201', 'AK301');

UPDATE mata_kuliah SET created_by = (
    SELECT id FROM users_profile WHERE email = 'dosen2@akbidmegabuana.ac.id' LIMIT 1
) WHERE course_code IN ('AK401', 'AK501', 'KB101', 'KK101', 'KM101', 'KA101');

-- Sample enrollments
INSERT INTO enrollments (student_id, mata_kuliah_id, status)
SELECT 
    s.id,
    mk.id,
    'active'
FROM users_profile s, mata_kuliah mk
WHERE s.nim_nip IN ('2024001', '2024002', '2024003')
AND mk.course_code IN ('AK101', 'AK201');

-- Create inventory records for existing equipment
INSERT INTO inventaris (equipment_id, stock_quantity, available_quantity)
SELECT id, 1, 1
FROM equipments;

COMMIT;