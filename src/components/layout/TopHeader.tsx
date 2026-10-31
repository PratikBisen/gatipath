import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/auth/AuthContext';
import { db } from '../../lib/db';
import { Avatar } from '../ui/Avatar';
import {
  Menu,
  RotateCcw,
  UserCheck,
  ChevronDown,
  LogOut,
  Bell,
  Sparkles,
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface TopHeaderProps {
  onOpenMobileSidebar: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onOpenMobileSidebar }) => {
  const { currentUser, currentRole, switchRole, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  const isStudent = currentRole === 'student';
  const classRoom = db.getClassRoom();
  const students = db.getStudents();
  const strugglingCount = students.filter(s => {
    const p = db.getStudentProgress(s.id);
    const avg = p.length > 0 ? p.reduce((acc, i) => acc + i.masteryScore, 0) / p.length : 0;
    return avg < 55;
  }).length;

  const handleReset = () => {
    if (window.confirm('Reset all demonstration records to initial reference state? (Aarav at initial stage, Priya advanced, Rohan needing prerequisite practice)')) {
      setResetting(true);
      db.resetDemoData();
      setTimeout(() => {
        setResetting(false);
        window.location.reload();
      }, 600);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-surface/95 backdrop-blur-xs border-b border-border flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Left: Mobile hamburger & Context breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 rounded-lg text-charcoal-muted hover:text-charcoal hover:bg-canvas lg:hidden"
          title="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Classroom / Module context pill */}
        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="font-semibold text-charcoal">
            {isStudent ? 'Fractions Pilot Module' : classRoom.name}
          </span>
          <span className="text-charcoal-light">/</span>
          <span className="px-2 py-0.5 rounded-md bg-canvas-subtle border border-border text-charcoal-muted font-medium text-[11px]">
            Academic Year 2026–27
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Reset Demo Data Button */}
        <button
          onClick={handleReset}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-surface text-charcoal-muted hover:text-charcoal hover:bg-canvas text-xs font-medium transition-colors ${
            resetting ? 'bg-primary-subtle text-primary border-primary/30' : ''
          }`}
          title="Reset demonstration data to clean state"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin text-primary' : ''}`} />
          <span className="hidden md:inline">Reset Demo</span>
        </button>

        {/* Demo Persona Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowPersonaMenu(!showPersonaMenu);
              setShowUserMenu(false);
              setShowNotificationPopup(false);
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-canvas-subtle hover:bg-canvas text-xs font-semibold text-charcoal transition-colors"
            title="Switch demo user"
          >
            <UserCheck className="w-3.5 h-3.5 text-primary" />
            <span className="hidden sm:inline">
              {isStudent ? 'Aarav (Student)' : 'Sunita (Teacher)'}
            </span>
            <ChevronDown className="w-3 h-3 text-charcoal-muted" />
          </button>

          {showPersonaMenu && (
            <div className="absolute right-0 mt-2 w-60 bg-surface rounded-xl shadow-floating border border-border p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2.5 py-1.5 text-[10px] font-bold text-charcoal-muted uppercase tracking-wider">
                Switch Active Persona
              </div>

              <button
                onClick={() => {
                  switchRole('student', 'student-aarav');
                  setShowPersonaMenu(false);
                  navigate('/student/dashboard');
                }}
                className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                  isStudent ? 'bg-primary-subtle text-primary font-semibold' : 'text-charcoal hover:bg-canvas'
                }`}
              >
                <div>
                  <p className="font-semibold">Aarav Sharma</p>
                  <p className="text-[10px] text-charcoal-muted">Student · Class 7 Pilot</p>
                </div>
                {isStudent && <span className="text-[10px] text-primary font-bold">Active</span>}
              </button>

              <button
                onClick={() => {
                  switchRole('teacher');
                  setShowPersonaMenu(false);
                  navigate('/teacher/dashboard');
                }}
                className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between mt-1 transition-colors ${
                  !isStudent ? 'bg-primary-subtle text-primary font-semibold' : 'text-charcoal hover:bg-canvas'
                }`}
              >
                <div>
                  <p className="font-semibold">Sunita Verma</p>
                  <p className="text-[10px] text-charcoal-muted">Teacher · Class 7-B Maths</p>
                </div>
                {!isStudent && <span className="text-[10px] text-primary font-bold">Active</span>}
              </button>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotificationPopup(!showNotificationPopup);
              setShowPersonaMenu(false);
              setShowUserMenu(false);
            }}
            className="p-2 rounded-lg text-charcoal-muted hover:text-charcoal hover:bg-canvas relative transition-colors"
            title="Class updates"
          >
            <Bell className="w-4 h-4" />
            {strugglingCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-600 ring-2 ring-white" />
            )}
          </button>

          {showNotificationPopup && (
            <div className="absolute right-0 mt-2 w-72 bg-surface rounded-xl shadow-floating border border-border p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-2 border-b border-border text-xs">
                <span className="font-bold text-charcoal">Real-Time Alerts</span>
                <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                  {strugglingCount} Attention Needed
                </span>
              </div>
              <div className="py-2 space-y-2 text-xs">
                <p className="text-charcoal-muted text-[11px] leading-relaxed">
                  <span className="font-semibold text-charcoal">Rohan Gupta & 3 others</span> have recent misconception flags in fraction addition.
                </p>
                <button
                  onClick={() => {
                    setShowNotificationPopup(false);
                    navigate('/teacher/dashboard');
                  }}
                  className="w-full text-center text-primary font-semibold hover:underline text-[11px] pt-1"
                >
                  View in Dashboard
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Account / User Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowPersonaMenu(false);
              setShowNotificationPopup(false);
            }}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-canvas transition-colors"
          >
            <Avatar
              name={currentUser?.displayName || 'User'}
              seed={currentUser && 'avatarSeed' in currentUser ? currentUser.avatarSeed : 'SV'}
              size="sm"
            />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-surface rounded-xl shadow-floating border border-border p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="p-2 border-b border-border">
                <p className="text-xs font-bold text-charcoal">{currentUser?.displayName}</p>
                <p className="text-[11px] text-charcoal-muted truncate">{currentUser?.email}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-rose-700 hover:bg-rose-50 flex items-center gap-2 font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
