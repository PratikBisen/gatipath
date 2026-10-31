import React from 'react';
import { TopHeader } from './TopHeader';
import { useAuth } from '../../lib/auth/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { Compass, GraduationCap, Award, BarChart3, Users, ClipboardList } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { currentRole } = useAuth();
  const location = useLocation();
  const isTeacher = currentRole === 'teacher';

  const teacherMobileNav = [
    { label: 'Overview', path: '/teacher/dashboard', icon: BarChart3 },
    { label: 'Roster', path: '/teacher/students', icon: Users },
    { label: 'Insights', path: '/teacher/insights', icon: Compass },
    { label: 'Actions', path: '/teacher/interventions', icon: ClipboardList },
  ];

  const studentMobileNav = [
    { label: 'Study', path: '/student/dashboard', icon: Compass },
    { label: 'Journey', path: '/student/path', icon: GraduationCap },
    { label: 'Assess', path: '/student/assessments', icon: Award },
  ];

  const mobileNav = isTeacher ? teacherMobileNav : studentMobileNav;

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1A1817] flex flex-col antialiased selection:bg-[#EAE4DC] selection:text-[#1A1817]">
      {/* Top Academic Folio Masthead */}
      <TopHeader />

      {/* Main Study / Command Canvas */}
      <main className="flex-1 pb-24 md:pb-12">
        {children}
      </main>

      {/* Understated Editorial Colophon / Footer */}
      <footer className="border-t border-[#E8E3DA] bg-[#F7F3EB] py-6 px-4 sm:px-6 lg:px-8 text-xs text-[#7A7265] hidden md:block">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-editorial font-bold text-sm text-[#1A1817]">GĀTIPATH</span>
            <span className="text-[#A39B8F]">/</span>
            <span>Teacher-Guided Deterministic Adaptive Learning System</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px] text-[#6E675B]">
            <span>CBSE Class 7 Mathematics · Pilot Fractions</span>
            <span>Zero Mocked Models · Pure Algorithmic Evaluation</span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Dock */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#E2DBD0] px-3 py-2 flex items-center justify-around shadow-lg">
        {mobileNav.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-md transition-all ${
                isActive ? 'text-[#1A1817] font-semibold' : 'text-[#7D7569] hover:text-[#1A1817]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#1B4332]' : 'text-[#8C8377]'}`} />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
