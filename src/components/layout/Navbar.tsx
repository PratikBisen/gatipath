import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth/AuthContext';
import { db } from '../../lib/db';
import {
  Compass,
  GraduationCap,
  Users,
  BarChart3,
  ClipboardList,
  RotateCcw,
  LogOut,
  ChevronDown,
  UserCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, currentRole, switchRole, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showSwitchDropdown, setShowSwitchDropdown] = useState(false);
  const [resetFeedback, setResetFeedback] = useState(false);

  const isStudent = currentRole === 'student';

  const handleResetData = () => {
    if (window.confirm('Reset all demonstration data to original state? (Aarav at initial stage, Priya advanced, Rohan needing prerequisite practice)')) {
      db.resetDemoData();
      setResetFeedback(true);
      setTimeout(() => {
        setResetFeedback(false);
        window.location.reload();
      }, 700);
    }
  };

  const navLinks = isStudent
    ? [
        { label: 'Dashboard', path: '/student/dashboard', icon: Compass },
        { label: 'Learning Path', path: '/student/path', icon: GraduationCap },
        { label: 'Assessments', path: '/student/assessments', icon: ClipboardList },
      ]
    : [
        { label: 'Class Overview', path: '/teacher/dashboard', icon: BarChart3 },
        { label: 'Students Roster', path: '/teacher/students', icon: Users },
        { label: 'Class Insights', path: '/teacher/insights', icon: Compass },
        { label: 'Interventions', path: '/teacher/interventions', icon: ClipboardList },
      ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-borderSoft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg shadow-sm">
                G
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-lg tracking-tight text-charcoal group-hover:text-primary transition-colors">
                  GatiPath
                </span>
                <span className="text-[10px] text-charcoal-muted -mt-1 font-medium hidden sm:inline">
                  Learning that moves at your pace
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(link => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-subtle text-primary font-semibold'
                        : 'text-charcoal-muted hover:text-charcoal hover:bg-canvas'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Controls: Role Switcher, Reset, Profile */}
          <div className="flex items-center gap-2.5">
            {/* Quick Demo Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowSwitchDropdown(!showSwitchDropdown)}
                className="inline-flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-borderSoft bg-canvas hover:bg-white transition-colors"
                title="Switch demo persona"
              >
                <UserCheck className="w-3.5 h-3.5 text-primary" />
                <span className="hidden sm:inline text-charcoal font-semibold">
                  {isStudent ? 'Demo: Aarav (Student)' : 'Demo: Sunita (Teacher)'}
                </span>
                <span className="sm:hidden text-charcoal font-semibold">
                  {isStudent ? 'Student' : 'Teacher'}
                </span>
                <ChevronDown className="w-3 h-3 text-charcoal-muted" />
              </button>

              {showSwitchDropdown && (
                <div className="absolute right-0 mt-1 w-56 bg-white rounded-xl shadow-floating border border-borderSoft p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-2 py-1.5 text-[11px] font-semibold text-charcoal-muted uppercase tracking-wider">
                    Demonstration Persona
                  </div>
                  <button
                    onClick={() => {
                      switchRole('student', 'student-aarav');
                      setShowSwitchDropdown(false);
                      navigate('/student/dashboard');
                    }}
                    className={`w-full text-left px-2.5 py-2 text-xs rounded-lg flex items-center justify-between ${
                      isStudent ? 'bg-primary-subtle text-primary font-semibold' : 'text-charcoal hover:bg-canvas'
                    }`}
                  >
                    <div>
                      <p className="font-medium">Aarav Sharma</p>
                      <p className="text-[10px] text-charcoal-muted">Student · Class 7</p>
                    </div>
                    {isStudent && <span className="text-[10px] text-primary">Active</span>}
                  </button>
                  <button
                    onClick={() => {
                      switchRole('teacher');
                      setShowSwitchDropdown(false);
                      navigate('/teacher/dashboard');
                    }}
                    className={`w-full text-left px-2.5 py-2 text-xs rounded-lg flex items-center justify-between mt-1 ${
                      !isStudent ? 'bg-primary-subtle text-primary font-semibold' : 'text-charcoal hover:bg-canvas'
                    }`}
                  >
                    <div>
                      <p className="font-medium">Sunita Verma</p>
                      <p className="text-[10px] text-charcoal-muted">Teacher · Class 7-B Maths</p>
                    </div>
                    {!isStudent && <span className="text-[10px] text-primary">Active</span>}
                  </button>
                </div>
              )}
            </div>

            {/* Reset Demo Data Button */}
            <button
              onClick={handleResetData}
              className={`p-1.5 text-xs font-medium rounded-lg border border-borderSoft bg-white hover:bg-canvas text-charcoal-muted hover:text-charcoal transition-colors flex items-center gap-1.5 ${
                resetFeedback ? 'bg-primary-light text-primary' : ''
              }`}
              title="Reset demonstration data to original starting state"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${resetFeedback ? 'animate-spin text-primary' : ''}`} />
              <span className="hidden lg:inline text-xs">Reset Demo</span>
            </button>

            {/* Logout */}
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="p-1.5 text-charcoal-muted hover:text-danger rounded-lg hover:bg-canvas transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
