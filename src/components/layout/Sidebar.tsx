import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth/AuthContext';
import { db } from '../../lib/db';
import {
  BarChart3,
  Users,
  Compass,
  ClipboardList,
  GraduationCap,
  Award,
  ShieldCheck,
  X,
  LucideIcon
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  description: string;
  badge?: string;
  badgeAlert?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentRole, currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isStudent = currentRole === 'student';
  const classRoom = db.getClassRoom();
  const pendingInterventionsCount = db.getTeacherInterventions().filter(i => i.status === 'pending').length;
  const studentsCount = db.getStudents().length;

  const teacherNavLinks: NavItem[] = [
    {
      label: 'Class Overview',
      path: '/teacher/dashboard',
      icon: BarChart3,
      description: 'Key metrics & guidance',
    },
    {
      label: 'Students Roster',
      path: '/teacher/students',
      icon: Users,
      badge: `${studentsCount}`,
      description: 'Individual profiles & mastery',
    },
    {
      label: 'Class Insights',
      path: '/teacher/insights',
      icon: Compass,
      description: 'Diagnostics & error patterns',
    },
    {
      label: 'Interventions',
      path: '/teacher/interventions',
      icon: ClipboardList,
      badge: pendingInterventionsCount > 0 ? `${pendingInterventionsCount}` : undefined,
      badgeAlert: pendingInterventionsCount > 0,
      description: 'Targeted support actions',
    },
  ];

  const studentNavLinks: NavItem[] = [
    {
      label: 'My Learning',
      path: '/student/dashboard',
      icon: Compass,
      description: 'Current topic & focus',
    },
    {
      label: 'Learning Path',
      path: '/student/path',
      icon: GraduationCap,
      description: 'Curriculum roadmap & DAG',
    },
    {
      label: 'Assessments',
      path: '/student/assessments',
      icon: Award,
      description: 'Summative checkpoints',
    },
  ];

  const links = isStudent ? studentNavLinks : teacherNavLinks;

  const handleNavClick = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-charcoal/40 backdrop-blur-2xs lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-surface border-r border-border flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-border flex items-center justify-between">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-2.5 group select-none"
          >
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-heading font-extrabold text-base shadow-2xs group-hover:bg-primary-hover transition-colors">
              G
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-base tracking-tight text-charcoal group-hover:text-primary transition-colors">
                GatiPath
              </span>
              <span className="text-[10px] text-charcoal-muted -mt-0.5 font-medium tracking-wide">
                Adaptive Learning
              </span>
            </div>
          </Link>

          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-charcoal-muted hover:text-charcoal hover:bg-canvas lg:hidden"
            title="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Classroom / User Context Badge */}
        <div className="p-4 pb-2">
          <div className="p-3 rounded-xl bg-canvas-subtle border border-border/80 flex items-center justify-between">
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block">
                {isStudent ? 'Current Student' : 'Assigned Class'}
              </span>
              <p className="text-xs font-bold text-charcoal truncate mt-0.5">
                {isStudent
                  ? currentUser?.displayName || 'Aarav Sharma'
                  : classRoom.name}
              </p>
              <p className="text-[10px] text-charcoal-muted truncate">
                {isStudent ? 'Class 7 · Fractions Pilot' : 'Class 7 · Mathematics'}
              </p>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 ml-2" title="Active session" />
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          <div className="px-2 py-1 text-[10px] font-bold text-charcoal-light uppercase tracking-wider">
            {isStudent ? 'Student Journey' : 'Teacher Command Center'}
          </div>

          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;

            return (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-primary-subtle text-primary font-semibold shadow-2xs'
                    : 'text-charcoal-muted hover:text-charcoal hover:bg-canvas'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-primary' : 'text-charcoal-muted group-hover:text-charcoal'
                    }`}
                  />
                  <span className="truncate">{link.label}</span>
                </div>

                {link.badge && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      link.badgeAlert
                        ? 'bg-amber-100 text-amber-800'
                        : isActive
                        ? 'bg-primary text-white'
                        : 'bg-canvas text-charcoal-muted'
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer info */}
        <div className="p-4 border-t border-border bg-canvas-subtle/30 text-xs">
          <div className="flex items-center justify-between text-charcoal-muted">
            <span className="text-[11px] font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>Pilot Module 2026</span>
            </span>
            <span className="text-[10px] text-charcoal-light font-mono">v1.2</span>
          </div>
        </div>
      </aside>
    </>
  );
};
