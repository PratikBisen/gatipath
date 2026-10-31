-- GatiPath Schema Definition for Supabase / PostgreSQL
-- Class 7 Mathematics Fractions Adaptive Learning Platform

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Students
CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(50) PRIMARY KEY,
    display_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    class_level INTEGER NOT NULL DEFAULT 7,
    preferred_language VARCHAR(50) DEFAULT 'en',
    avatar_seed VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Teachers
CREATE TABLE IF NOT EXISTS teachers (
    id VARCHAR(50) PRIMARY KEY,
    display_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Classes
CREATE TABLE IF NOT EXISTS classes (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    class_level INTEGER NOT NULL,
    teacher_id VARCHAR(50) REFERENCES teachers(id) ON DELETE CASCADE,
    academic_year VARCHAR(20) DEFAULT '2026-2027'
);

-- 4. Class Students
CREATE TABLE IF NOT EXISTS class_students (
    id VARCHAR(50) PRIMARY KEY,
    class_id VARCHAR(50) REFERENCES classes(id) ON DELETE CASCADE,
    student_id VARCHAR(50) REFERENCES students(id) ON DELETE CASCADE,
    roll_number INTEGER,
    UNIQUE(class_id, student_id)
);

-- 5. Topics
CREATE TABLE IF NOT EXISTS topics (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    class_level INTEGER NOT NULL DEFAULT 7,
    subject VARCHAR(50) NOT NULL DEFAULT 'Mathematics',
    sequence_order INTEGER NOT NULL,
    estimated_minutes INTEGER DEFAULT 20
);

-- 6. Topic Prerequisites
CREATE TABLE IF NOT EXISTS topic_prerequisites (
    id VARCHAR(50) PRIMARY KEY,
    topic_id VARCHAR(50) REFERENCES topics(id) ON DELETE CASCADE,
    prerequisite_topic_id VARCHAR(50) REFERENCES topics(id) ON DELETE CASCADE,
    minimum_mastery INTEGER DEFAULT 70,
    UNIQUE(topic_id, prerequisite_topic_id)
);

-- 7. Questions
CREATE TABLE IF NOT EXISTS questions (
    id VARCHAR(50) PRIMARY KEY,
    topic_id VARCHAR(50) REFERENCES topics(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    visual_model JSONB,
    question_type VARCHAR(30) DEFAULT 'multiple_choice',
    options JSONB,
    difficulty VARCHAR(20) NOT NULL,
    correct_answer TEXT NOT NULL,
    explanation TEXT NOT NULL,
    hint TEXT NOT NULL,
    misconception_tag VARCHAR(100),
    prerequisite_topic VARCHAR(50) REFERENCES topics(id)
);

-- 8. Attempts
CREATE TABLE IF NOT EXISTS attempts (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) REFERENCES students(id) ON DELETE CASCADE,
    question_id VARCHAR(50) REFERENCES questions(id) ON DELETE CASCADE,
    topic_id VARCHAR(50) REFERENCES topics(id) ON DELETE CASCADE,
    submitted_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    hint_used BOOLEAN DEFAULT FALSE,
    score_credit INTEGER NOT NULL,
    detected_misconception VARCHAR(100),
    time_taken_seconds INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Student Topic Progress
CREATE TABLE IF NOT EXISTS student_topic_progress (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) REFERENCES students(id) ON DELETE CASCADE,
    topic_id VARCHAR(50) REFERENCES topics(id) ON DELETE CASCADE,
    mastery_score INTEGER NOT NULL DEFAULT 0,
    total_attempts INTEGER NOT NULL DEFAULT 0,
    correct_attempts INTEGER NOT NULL DEFAULT 0,
    hints_used_count INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'not_started',
    last_assessment_score INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, topic_id)
);

-- 10. Recommendations
CREATE TABLE IF NOT EXISTS recommendations (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) REFERENCES students(id) ON DELETE CASCADE,
    topic_id VARCHAR(50) REFERENCES topics(id) ON DELETE CASCADE,
    recommendation_type VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    explanation TEXT NOT NULL,
    misconception_tag VARCHAR(100),
    suggested_action_label VARCHAR(100),
    suggested_action_route VARCHAR(150),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Teacher Interventions
CREATE TABLE IF NOT EXISTS teacher_interventions (
    id VARCHAR(50) PRIMARY KEY,
    teacher_id VARCHAR(50) REFERENCES teachers(id) ON DELETE CASCADE,
    student_id VARCHAR(50) REFERENCES students(id) ON DELETE CASCADE,
    topic_id VARCHAR(50) REFERENCES topics(id) ON DELETE CASCADE,
    intervention_type VARCHAR(50) NOT NULL,
    intervention_note TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);
