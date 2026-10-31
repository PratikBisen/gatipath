# DATABASE SCHEMA — GatiPath

## Relational Entity Model

```sql
-- 1. Students
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    display_name VARCHAR(100) NOT NULL,
    class_level INTEGER NOT NULL DEFAULT 7,
    preferred_language VARCHAR(50) DEFAULT 'en',
    avatar_seed VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Teachers
CREATE TABLE teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    display_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Classes
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    class_level INTEGER NOT NULL,
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    academic_year VARCHAR(20) DEFAULT '2026-2027'
);

-- 4. Class Students
CREATE TABLE class_students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    roll_number INTEGER,
    UNIQUE(class_id, student_id)
);

-- 5. Topics
CREATE TABLE topics (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    class_level INTEGER NOT NULL DEFAULT 7,
    subject VARCHAR(50) NOT NULL DEFAULT 'Mathematics',
    sequence_order INTEGER NOT NULL,
    estimated_minutes INTEGER DEFAULT 20
);

-- 6. Topic Prerequisites
CREATE TABLE topic_prerequisites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id VARCHAR(50) REFERENCES topics(id) ON DELETE CASCADE,
    prerequisite_topic_id VARCHAR(50) REFERENCES topics(id) ON DELETE CASCADE,
    minimum_mastery INTEGER DEFAULT 70,
    UNIQUE(topic_id, prerequisite_topic_id)
);

-- 7. Questions
CREATE TABLE questions (
    id VARCHAR(50) PRIMARY KEY,
    topic_id VARCHAR(50) REFERENCES topics(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    visual_model JSONB, -- Optional visual representation metadata
    question_type VARCHAR(30) DEFAULT 'multiple_choice', -- 'multiple_choice' | 'fraction_input'
    options JSONB, -- Array of { id, text, misconception_tag }
    difficulty VARCHAR(20) NOT NULL, -- 'easy' | 'medium' | 'hard'
    correct_answer TEXT NOT NULL,
    explanation TEXT NOT NULL,
    hint TEXT NOT NULL,
    misconception_tag VARCHAR(100),
    prerequisite_topic VARCHAR(50) REFERENCES topics(id)
);

-- 8. Attempts
CREATE TABLE attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    question_id VARCHAR(50) REFERENCES questions(id) ON DELETE CASCADE,
    submitted_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    hint_used BOOLEAN DEFAULT FALSE,
    detected_misconception VARCHAR(100),
    time_taken_seconds INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Student Topic Progress
CREATE TABLE student_topic_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    topic_id VARCHAR(50) REFERENCES topics(id) ON DELETE CASCADE,
    mastery_score INTEGER NOT NULL DEFAULT 0, -- 0 to 100
    total_attempts INTEGER NOT NULL DEFAULT 0,
    correct_attempts INTEGER NOT NULL DEFAULT 0,
    hints_used_count INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'not_started', -- 'not_started' | 'in_progress' | 'ready_for_test' | 'mastered'
    last_assessment_score INTEGER,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, topic_id)
);

-- 10. Recommendations
CREATE TABLE recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    topic_id VARCHAR(50) REFERENCES topics(id) ON DELETE CASCADE,
    recommendation_type VARCHAR(50) NOT NULL, -- 'targeted_explanation' | 'prerequisite_review' | 'guided_practice' | 'advance_difficulty' | 'take_assessment'
    explanation TEXT NOT NULL,
    misconception_tag VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active', -- 'active' | 'dismissed' | 'completed'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Teacher Interventions
CREATE TABLE teacher_interventions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    topic_id VARCHAR(50) REFERENCES topics(id) ON DELETE CASCADE,
    intervention_type VARCHAR(50) NOT NULL, -- 'assign_remedial' | 'one_on_one' | 'peer_buddy' | 'exempt'
    intervention_note TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending' | 'in_progress' | 'completed'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);
```
