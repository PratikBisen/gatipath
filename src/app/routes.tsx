import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../lib/auth/AuthContext';
import { AppLayout } from '../components/layout/AppLayout';

// Screens
import { LoginScreen } from '../features/auth/LoginScreen';
import { StudentDashboard } from '../features/student/StudentDashboard';
import { LearningPath } from '../features/student/LearningPath';
import { AssessmentsList } from '../features/student/AssessmentsList';
import { DiagnosticScreen } from '../features/assessments/DiagnosticScreen';
import { LearnScreen } from '../features/learning/LearnScreen';
import { SolveScreen } from '../features/learning/SolveScreen';
import { TestScreen } from '../features/assessments/TestScreen';
import { TeacherDashboard } from '../features/teacher/TeacherDashboard';
import { StudentRoster } from '../features/teacher/StudentRoster';
import { StudentDetail } from '../features/teacher/StudentDetail';
import { ClassInsights } from '../features/teacher/ClassInsights';
import { InterventionsList } from '../features/teacher/InterventionsList';
import { EvaluationReport } from '../features/developer/EvaluationReport';

const TeacherGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isTeacher } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isTeacher) return <Navigate to="/student/dashboard" replace />;
  return <>{children}</>;
};

const StudentGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
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
        path="/student/diagnostic"
        element={
          <AppLayout>
            <DiagnosticScreen />
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

      {/* Teacher Screens (Role Protected) */}
      <Route
        path="/teacher/dashboard"
        element={
          <TeacherGuard>
            <AppLayout>
              <TeacherDashboard />
            </AppLayout>
          </TeacherGuard>
        }
      />
      <Route
        path="/teacher/students"
        element={
          <TeacherGuard>
            <AppLayout>
              <StudentRoster />
            </AppLayout>
          </TeacherGuard>
        }
      />
      <Route
        path="/teacher/student/:studentId"
        element={
          <TeacherGuard>
            <AppLayout>
              <StudentDetail />
            </AppLayout>
          </TeacherGuard>
        }
      />
      <Route
        path="/teacher/insights"
        element={
          <TeacherGuard>
            <AppLayout>
              <ClassInsights />
            </AppLayout>
          </TeacherGuard>
        }
      />
      <Route
        path="/teacher/interventions"
        element={
          <TeacherGuard>
            <AppLayout>
              <InterventionsList />
            </AppLayout>
          </TeacherGuard>
        }
      />

      {/* Developer & Engine Evaluation Report */}
      <Route
        path="/evaluation"
        element={
          <AppLayout>
            <EvaluationReport />
          </AppLayout>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
