-- GatiPath Demonstration Seed Data
-- Pilot: Class 7 Mathematics - Fractions

INSERT INTO teachers (id, display_name, email)
VALUES ('teacher-sunita', 'Sunita Verma', 'teacher@gatipath.demo')
ON CONFLICT (id) DO NOTHING;

INSERT INTO classes (id, name, class_level, teacher_id, academic_year)
VALUES ('class-7b', 'Class 7-B Mathematics', 7, 'teacher-sunita', '2026-2027')
ON CONFLICT (id) DO NOTHING;

INSERT INTO students (id, display_name, email, class_level, preferred_language, avatar_seed) VALUES
('student-aarav', 'Aarav Sharma', 'student@gatipath.demo', 7, 'en', 'AS'),
('student-priya', 'Priya Patel', 'priya@gatipath.demo', 7, 'en', 'PP'),
('student-rohan', 'Rohan Gupta', 'rohan@gatipath.demo', 7, 'en', 'RG'),
('student-ananya', 'Ananya Iyer', 'ananya@gatipath.demo', 7, 'en', 'AI'),
('student-kabir', 'Kabir Mehta', 'kabir@gatipath.demo', 7, 'en', 'KM'),
('student-diya', 'Diya Nair', 'diya@gatipath.demo', 7, 'en', 'DN'),
('student-vihaan', 'Vihaan Reddy', 'vihaan@gatipath.demo', 7, 'en', 'VR'),
('student-meera', 'Meera Joshi', 'meera@gatipath.demo', 7, 'en', 'MJ'),
('student-aditya', 'Aditya Singh', 'aditya@gatipath.demo', 7, 'en', 'AS2'),
('student-sara', 'Sara Khan', 'sara@gatipath.demo', 7, 'en', 'SK')
ON CONFLICT (id) DO NOTHING;

INSERT INTO topics (id, title, description, class_level, subject, sequence_order, estimated_minutes) VALUES
('topic-1', 'Understanding Fractions', 'Master numerators, denominators, proper & improper fractions, equivalence, and simplest forms.', 7, 'Mathematics', 1, 20),
('topic-2', 'Comparing Fractions', 'Compare and order like and unlike fractions using equivalent fractions and common denominators.', 7, 'Mathematics', 2, 25),
('topic-3', 'Addition & Subtraction of Fractions', 'Add and subtract like and unlike fractions without falling into common denominator addition traps.', 7, 'Mathematics', 3, 30),
('topic-4', 'Multiplication & Division of Fractions', 'Understand fraction multiplication, reciprocal concept, dividing fractions, and real-world word problems.', 7, 'Mathematics', 4, 30)
ON CONFLICT (id) DO NOTHING;

INSERT INTO topic_prerequisites (topic_id, prerequisite_topic_id, minimum_mastery) VALUES
('topic-2', 'topic-1', 70),
('topic-3', 'topic-1', 70),
('topic-3', 'topic-2', 70),
('topic-4', 'topic-1', 70),
('topic-4', 'topic-3', 70)
ON CONFLICT DO NOTHING;
