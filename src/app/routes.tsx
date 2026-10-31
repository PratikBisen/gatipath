import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../lib/auth/AuthContext';
import { Navbar } from '../components/layout/Navbar';
import { MobileNav } from '../components/layout/MobileNav';

// Screens
import { LoginScreen } from '../features/auth/LoginScreen';
import { StudentDashboard } from '../features/student/StudentDashboard';
import { LearningPath } from '../features/student/LearningPath';
import { AssessmentsList } from '../features/student/AssessmentsList';
import { LearnScreen } from '../features/learning/LearnScreen';
import { SolveScreen } from '../features/learning/SolveScreen';
import { TestScreen } from '../features/assessments/TestScreen';
import { TeacherDashboard } from '../features/teacher/TeacherDashboard';
import { StudentRoster } from '../features/teacher/StudentRoster';
import { StudentDetail } from '../features/teacher/StudentDetail';
import { ClassInsights } from '../features/teacher/ClassInsights';
import { InterventionsList } from '../features/teacher/InterventionsList';

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F7F8F5] pb-20 md:pb-10 flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <MobileNav />
    </div>
  );
};

export const AppRoutes: React.FC = () => {
  const { isAuthenticated, isTeacher, isStudent } = useAuth();

  return (
    <Routes>
      {/* Root redirect */}
      <Route
        path="/"
        element={
          !isAuthenticated ? (
            <Navigate to="/login" replace />
          ) : isTeacher ? (
            <Navigate to="/teacher/dashboard" replace />
          ) : (
            <Navigate to="/student/dashboard" replace />
          )
        }
      />

      {/* Auth */}
      <Route path="/login" element={<LoginScreen />} />

      {/* Student Screens */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedLayout>
            <StudentDashboard />
          </ProtectedLayout>
        }
      />
      <Route
        path="/student/path"
        element={
          <ProtectedLayout>
            <LearningPath />
          </ProtectedLayout>
        }
      />
      <Route
        path="/student/assessments"
        element={
          <ProtectedLayout>
            <AssessmentsList />
          </ProtectedLayout>
        }
      />
      <Route
        path="/learn/:topicId"
        element={
          <ProtectedLayout>
            <LearnScreen />
          </ProtectedLayout>
        }
      />
      <Route
        path="/solve/:topicId"
        element={
          <ProtectedLayout>
            <SolveScreen />
          </ProtectedLayout>
        }
      />
      <Route
        path="/test/:topicId"
        element={
          <ProtectedLayout>
            <TestScreen />
          </ProtectedLayout>
        }
      />

      {/* Teacher Screens */}
      <Route
        path="/teacher/dashboard"
        element={
          <ProtectedLayout>
            <TeacherDashboard />
          </ProtectedLayout>
        }
      />
      <Route
        path="/teacher/students"
        element={
          <ProtectedLayout>
            <StudentRoster />
          </ProtectedLayout>
        }
      />
      <Route
        path="/teacher/student/:studentId"
        element={
          <ProtectedLayout>
            <StudentDetail />
          </ProtectedLayout>
        }
      />
      <Route
        path="/teacher/insights"
        element={
          <ProtectedLayout>
            <ClassInsights />
          </ProtectedLayout>
        }
      />
      <Route
        path="/teacher/interventions"
        element={
          <ProtectedLayout>
            <InterventionsList />
          </ProtectedLayout>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
