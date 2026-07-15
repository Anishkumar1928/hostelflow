-- HostelFlow Complete PostgreSQL Schema (Simple Version)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE roles(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE users(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 role_id UUID REFERENCES roles(id),
 full_name VARCHAR(100) NOT NULL,
 email VARCHAR(100) UNIQUE NOT NULL,
 phone VARCHAR(20),
 password VARCHAR(255) NOT NULL,
 avatar TEXT,
 status BOOLEAN DEFAULT TRUE,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE students(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
 enrollment_no VARCHAR(50) UNIQUE,
 course VARCHAR(100),
 department VARCHAR(100),
 year INT,
 gender VARCHAR(20),
 dob DATE,
 guardian_name VARCHAR(100),
 guardian_phone VARCHAR(20),
 address TEXT,
 blood_group VARCHAR(10)
);

CREATE TABLE hostels(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 hostel_name VARCHAR(100),
 hostel_type VARCHAR(20),
 gender VARCHAR(20),
 capacity INT,
 address TEXT,
 warden_id UUID REFERENCES users(id)
);

CREATE TABLE rooms(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 hostel_id UUID REFERENCES hostels(id) ON DELETE CASCADE,
 room_number VARCHAR(20),
 floor INT,
 room_type VARCHAR(30),
 capacity INT,
 occupied INT DEFAULT 0,
 price NUMERIC(10,2),
 status VARCHAR(20) DEFAULT 'AVAILABLE'
);

CREATE TABLE applications(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 student_id UUID REFERENCES students(id),
 hostel_id UUID REFERENCES hostels(id),
 preferred_room_type VARCHAR(30),
 reason TEXT,
 status VARCHAR(20) DEFAULT 'PENDING',
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE allocations(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 student_id UUID REFERENCES students(id),
 room_id UUID REFERENCES rooms(id),
 allocated_date DATE,
 check_in DATE,
 check_out DATE,
 status VARCHAR(20) DEFAULT 'ACTIVE'
);

CREATE TABLE fee_heads(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 fee_name VARCHAR(100),
 amount NUMERIC(10,2),
 description TEXT
);

CREATE TABLE payments(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 student_id UUID REFERENCES students(id),
 fee_head_id UUID REFERENCES fee_heads(id),
 amount NUMERIC(10,2),
 payment_method VARCHAR(30),
 transaction_id VARCHAR(100),
 status VARCHAR(20),
 due_date DATE,
 paid_at TIMESTAMP
);

CREATE TABLE attendance(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 student_id UUID REFERENCES students(id),
 attendance_date DATE,
 check_in TIME,
 check_out TIME,
 status VARCHAR(20),
 marked_by UUID REFERENCES users(id)
);

CREATE TABLE leaves(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 student_id UUID REFERENCES students(id),
 from_date DATE,
 to_date DATE,
 reason TEXT,
 approved_by UUID REFERENCES users(id),
 status VARCHAR(20) DEFAULT 'PENDING'
);

CREATE TABLE visitors(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 student_id UUID REFERENCES students(id),
 visitor_name VARCHAR(100),
 relation VARCHAR(50),
 phone VARCHAR(20),
 entry_time TIMESTAMP,
 exit_time TIMESTAMP,
 status VARCHAR(20)
);

CREATE TABLE complaints(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 student_id UUID REFERENCES students(id),
 category VARCHAR(50),
 title VARCHAR(150),
 description TEXT,
 priority VARCHAR(20),
 assigned_to UUID REFERENCES users(id),
 status VARCHAR(20) DEFAULT 'OPEN',
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE complaint_comments(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 complaint_id UUID REFERENCES complaints(id) ON DELETE CASCADE,
 user_id UUID REFERENCES users(id),
 comment TEXT,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mess_menu(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 meal_date DATE,
 meal_type VARCHAR(30),
 menu TEXT,
 notes TEXT
);

CREATE TABLE meal_attendance(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 student_id UUID REFERENCES students(id),
 menu_id UUID REFERENCES mess_menu(id),
 status VARCHAR(20)
);

CREATE TABLE inventory(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 item_name VARCHAR(100),
 quantity INT,
 available_quantity INT,
 item_condition VARCHAR(30),
 last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE documents(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 student_id UUID REFERENCES students(id),
 document_type VARCHAR(50),
 file_name VARCHAR(150),
 file_url TEXT,
 uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID REFERENCES users(id),
 title VARCHAR(150),
 message TEXT,
 type VARCHAR(30),
 is_read BOOLEAN DEFAULT FALSE,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_rooms_hostel ON rooms(hostel_id);
CREATE INDEX idx_alloc_student ON allocations(student_id);
CREATE INDEX idx_payment_student ON payments(student_id);
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_leave_student ON leaves(student_id);
CREATE INDEX idx_complaint_student ON complaints(student_id);
