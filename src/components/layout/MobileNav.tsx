import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/auth/AuthContext';
import { Compass, GraduationCap, ClipboardList, BarChart3, Users } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { currentRole } = useAuth();
  const location = useLocation();

  const isStudent = currentRole === 'student';

  const navLinks = isStudent
    ? [
        { label: 'Home', path: '/student/dashboard', icon: Compass },
        { label: 'Learning Path', path: '/student/path', icon: GraduationCap },
        { label: 'Assessments', path: '/student/assessments', icon: ClipboardList },
      ]
    : [
        { label: 'Overview', path: '/teacher/dashboard', icon: BarChart3 },
        { label: 'Students', path: '/teacher/students', icon: Users },
        { label: 'Insights', path: '/teacher/insights', icon: Compass },
        { label: 'Intervene', path: '/teacher/interventions', icon: ClipboardList },
      ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-borderSoft px-2 py-1 flex items-center justify-around shadow-floating safe-area-pb">
      {navLinks.map(link => {
        const Icon = link.icon;
        const isActive = location.pathname === link.path;
        return (
          <Link
            key={link.path}
            to={link.path}
            className={`flex flex-col items-center justify-center min-w-[64px] min-h-[48px] py-1 rounded-lg transition-colors ${
              isActive ? 'text-primary font-semibold' : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span className="text-[11px] leading-tight">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
