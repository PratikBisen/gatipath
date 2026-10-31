import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../lib/auth/AuthContext';
import { AppLayout } from '../components/layout/AppLayout';

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
          <AppLayout>
            <StudentDashboard />
          </AppLayout>
        }
      />
      <Route
        path="/student/path"
        element={
          <AppLayout>
            <LearningPath />
          </AppLayout>
        }
      />
      <Route
        path="/student/assessments"
        element={
          <AppLayout>
            <AssessmentsList />
          </AppLayout>
        }
      />
      <Route
        path="/learn/:topicId"
        element={
          <AppLayout>
            <LearnScreen />
          </AppLayout>
        }
      />
      <Route
        path="/solve/:topicId"
        element={
          <AppLayout>
            <SolveScreen />
          </AppLayout>
        }
      />
      <Route
        path="/test/:topicId"
        element={
          <AppLayout>
            <TestScreen />
          </AppLayout>
        }
      />

      {/* Teacher Screens */}
      <Route
        path="/teacher/dashboard"
        element={
          <AppLayout>
            <TeacherDashboard />
          </AppLayout>
        }
      />
      <Route
        path="/teacher/students"
        element={
          <AppLayout>
            <StudentRoster />
          </AppLayout>
        }
      />
      <Route
        path="/teacher/student/:studentId"
        element={
          <AppLayout>
            <StudentDetail />
          </AppLayout>
        }
      />
      <Route
        path="/teacher/insights"
        element={
          <AppLayout>
            <ClassInsights />
          </AppLayout>
        }
      />
      <Route
        path="/teacher/interventions"
        element={
          <AppLayout>
            <InterventionsList />
          </AppLayout>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
