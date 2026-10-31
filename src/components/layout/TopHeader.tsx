import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../lib/auth/AuthContext';
import { useNetworkStatus } from '../../lib/offline/syncManager';
import { useTranslation, SupportedLanguage } from '../../lib/i18n';
import { db } from '../../lib/db';
import { PrivacyModal } from '../ui/PrivacyModal';
import {
  RotateCcw,
  Sparkles,
  ChevronDown,
  UserCheck,
  Compass,
  GraduationCap,
  Award,
  BarChart3,
  Users,
  ClipboardList,
  Menu,
  X,
  BookOpen,
  Wifi,
  WifiOff,
  Languages,
  Activity,
  ShieldCheck
} from 'lucide-react';

export const TopHeader: React.FC = () => {
  const { currentUser, currentRole, switchRole, logout } = useAuth();
  const { isOnline, queuedCount, syncNow } = useNetworkStatus();
  const { language, setLanguage, t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isTeacher = currentRole === 'teacher';
  const isStudent = currentRole === 'student';
  const classRoom = db.getClassRoom();
  const students = db.getStudents();
  const pendingInterventions = db.getTeacherInterventions().filter(i => i.status === 'pending').length;

  const handleReset = () => {
    if (window.confirm('Reset all demo student progress, attempts, and interventions back to baseline?')) {
      setResetting(true);
      db.resetDemoData();
      setTimeout(() => {
        setResetting(false);
        window.location.reload();
      }, 500);
    }
  };

  interface NavItem {
    label: string;
    path: string;
    num: string;
    badge?: string;
  }

  const teacherNav: NavItem[] = [
    { label: t('commandDossier'), path: '/teacher/dashboard', num: '01' },
    { label: t('scholarLedger'), path: '/teacher/students', num: '02', badge: `${students.length}` },
    { label: t('diagnosticAnalytics'), path: '/teacher/insights', num: '03' },
    { label: t('interventions'), path: '/teacher/interventions', num: '04', badge: pendingInterventions > 0 ? `${pendingInterventions}` : undefined },
  ];

  const studentNav: NavItem[] = [
    { label: t('studyDesk'), path: '/student/dashboard', num: '01' },
    { label: t('curriculumJourney'), path: '/student/path', num: '02' },
    { label: t('summativeTests'), path: '/student/assessments', num: '03' },
  ];

  const activeNav = isTeacher ? teacherNav : studentNav;

  return (
    <>
      <header className="w-full bg-[#FAF7F2] border-b border-[#E6DFD5] sticky top-0 z-40 transition-colors">
        {/* Top Academic Folio Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between border-b border-[#EFE9DF]">
            {/* Brand & Editorial Title */}
            <div className="flex items-center gap-3 sm:gap-4">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded bg-[#1A1817] text-[#FAF7F2] flex items-center justify-center font-editorial font-bold text-lg tracking-wider transition-transform group-hover:scale-105">
                  G
                </div>
                <div className="flex flex-col">
                  <span className="font-editorial text-lg sm:text-xl font-bold tracking-tight text-[#1A1817] leading-none group-hover:text-[#1B4332] transition-colors">
                    {t('appName')}
                  </span>
                  <span className="hidden sm:block text-[10px] uppercase font-mono tracking-widest text-[#7D7569] mt-0.5">
                    {t('tagline')}
                  </span>
                </div>
              </Link>

              <span className="hidden md:inline-block h-4 w-[1px] bg-[#DDD6CA] mx-1" />

              {/* Academic Context Badge */}
              <div className="hidden md:flex items-center gap-2 text-xs text-[#5E584F]">
                <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#F2EDE4] border border-[#E2DBD0] text-[#4A453D]">
                  Class 7-B Mathematics
                </span>
                <span className="text-[#8C8377] text-[11px]">· Fractions Pilot (NCERT Ch 2)</span>
              </div>
            </div>

            {/* Right Header Utilities */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {/* Online/Offline Status Indicator */}
              <div
                className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono rounded border ${
                  isOnline
                    ? 'bg-[#EAF2ED] border-[#B7D8C4] text-[#1B4332]'
                    : 'bg-[#FAF1E4] border-[#E8D4BE] text-[#8C6239]'
                }`}
                title={isOnline ? 'Network online · Direct edge sync active' : `Offline · ${queuedCount} attempts buffered locally`}
              >
                {isOnline ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1B4332]" />
                    <span>Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 text-[#C57D36]" />
                    <span>Offline ({queuedCount})</span>
                  </>
                )}
              </div>

              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-mono rounded border border-[#E0D8CC] bg-[#F7F3EB] text-[#5C5549] hover:border-[#1A1817] transition-all"
                  title="Change language / भाषा बदलें"
                >
                  <Languages className="w-3.5 h-3.5 text-[#5C5549]" />
                  <span className="uppercase font-semibold">{language}</span>
                  <ChevronDown className="w-3 h-3 text-[#888073]" />
                </button>

                {showLangMenu && (
                  <div
                    className="absolute right-0 mt-2 w-36 rounded-lg bg-white border border-[#E2DBD0] shadow-lg z-50 p-1 text-xs font-mono"
                    onClick={() => setShowLangMenu(false)}
                  >
                    <button
                      onClick={() => setLanguage('en')}
                      className={`w-full text-left px-3 py-1.5 rounded hover:bg-[#F7F3EB] flex items-center justify-between ${
                        language === 'en' ? 'font-bold text-[#1B4332] bg-[#FAF8F5]' : 'text-[#4A453D]'
                      }`}
                    >
                      <span>English</span>
                      {language === 'en' && <span className="text-[10px]">✓</span>}
                    </button>
                    <button
                      onClick={() => setLanguage('hi')}
                      className={`w-full text-left px-3 py-1.5 rounded hover:bg-[#F7F3EB] flex items-center justify-between ${
                        language === 'hi' ? 'font-bold text-[#1B4332] bg-[#FAF8F5]' : 'text-[#4A453D]'
                      }`}
                    >
                      <span>हिंदी (Hindi)</span>
                      {language === 'hi' && <span className="text-[10px]">✓</span>}
                    </button>
                    <button
                      onClick={() => setLanguage('mr')}
                      className={`w-full text-left px-3 py-1.5 rounded hover:bg-[#F7F3EB] flex items-center justify-between ${
                        language === 'mr' ? 'font-bold text-[#1B4332] bg-[#FAF8F5]' : 'text-[#4A453D]'
                      }`}
                    >
                      <span>मराठी (Marathi)</span>
                      {language === 'mr' && <span className="text-[10px]">✓</span>}
                    </button>
                  </div>
                )}
              </div>

              {/* Engine Evidence / Evaluation Link */}
              <Link
                to="/evaluation"
                className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded border border-[#C57D36]/40 bg-[#FAF1E4] text-[#8C6239] hover:bg-[#F5E6D3] transition-all"
                title="Inspect adaptive engine measurable benchmarks and evaluation matrix"
              >
                <Activity className="w-3.5 h-3.5 text-[#C57D36]" />
                <span className="font-semibold">Engine Evidence</span>
              </Link>

              {/* Privacy Disclosure Trigger */}
              <button
                onClick={() => setShowPrivacyModal(true)}
                className="inline-flex items-center gap-1 p-1.5 sm:px-2 sm:py-1 text-xs font-mono rounded border border-[#E0D8CC] bg-[#F7F3EB] text-[#5C5549] hover:bg-[#EFE9DF] hover:text-[#1A1817] transition-all"
                title="Child Data Safety & DPDP 2023 Policy"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#1B4332]" />
                <span className="hidden xl:inline">Safety</span>
              </button>

              {/* Reset Demo State Button */}
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1 text-xs font-mono rounded border border-[#E0D8CC] bg-[#F7F3EB] text-[#5C5549] hover:bg-[#EFE9DF] hover:text-[#1A1817] transition-all"
                title="Reset records to default demonstration data"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin text-[#1B4332]' : 'text-[#7A7265]'}`} />
                <span className="hidden sm:inline">Reset</span>
              </button>

              {/* Persona Switcher Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded border border-[#DCD5C9] bg-white text-xs font-medium text-[#1A1817] hover:border-[#1A1817] transition-all shadow-xs"
                >
                  <span className="w-2 h-2 rounded-full bg-[#2D6A4F] shrink-0" />
                  <span className="font-medium truncate max-w-[80px] sm:max-w-none">
                    {(currentUser?.displayName || (isTeacher ? 'Sunita' : 'Aarav')).split(' ')[0]}
                  </span>
                  <span className="hidden sm:inline font-mono text-[10px] text-[#7A7265] uppercase px-1 py-0.2 bg-[#F4EFE6] rounded">
                    {isTeacher ? 'Teacher' : 'Student'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[#888073]" />
                </button>

                {showPersonaMenu && (
                  <div
                    className="absolute right-0 mt-2 w-72 rounded-lg bg-white border border-[#E2DBD0] shadow-xl z-50 p-2 text-xs"
                    onClick={() => setShowPersonaMenu(false)}
                  >
                    <div className="px-3 py-2 border-b border-[#EFEAE2]">
                      <p className="font-mono uppercase text-[10px] tracking-wider text-[#7A7265]">
                        Select Active Persona (Sandbox)
                      </p>
                      <p className="text-[11px] text-[#4A453D] mt-0.5">
                        Switch context instantly to evaluate student and teacher workflows.
                      </p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          switchRole('student', 'student-aarav');
                          navigate('/student/dashboard');
                        }}
                        className={`w-full text-left px-3 py-2 rounded flex items-center justify-between hover:bg-[#FAF7F2] transition-colors ${
                          isStudent && currentUser?.id === 'student-aarav' ? 'bg-[#F4EFE6] font-semibold text-[#1A1817]' : 'text-[#4A453D]'
                        }`}
                      >
                        <div>
                          <div className="font-medium">Aarav Sharma</div>
                          <div className="text-[11px] text-[#7A7265]">Student · Topic 3 denominator trap</div>
                        </div>
                        <span className="text-[10px] font-mono text-[#8C2828] bg-[#FCE8E8] px-1.5 py-0.5 rounded">Aarav Demo</span>
                      </button>

                      <button
                        onClick={() => {
                          switchRole('student', 'student-priya');
                          navigate('/student/dashboard');
                        }}
                        className={`w-full text-left px-3 py-2 rounded flex items-center justify-between hover:bg-[#FAF7F2] transition-colors ${
                          isStudent && currentUser?.id === 'student-priya' ? 'bg-[#F4EFE6] font-semibold text-[#1A1817]' : 'text-[#4A453D]'
                        }`}
                      >
                        <div>
                          <div className="font-medium">Priya Patel</div>
                          <div className="text-[11px] text-[#7A7265]">Student · Advanced cohort (92% mastery)</div>
                        </div>
                        <span className="text-[10px] font-mono text-[#2D6A4F] bg-[#E8F4EE] px-1.5 py-0.5 rounded">Advanced</span>
                      </button>

                      <button
                        onClick={() => {
                          switchRole('student', 'student-rohan');
                          navigate('/student/dashboard');
                        }}
                        className={`w-full text-left px-3 py-2 rounded flex items-center justify-between hover:bg-[#FAF7F2] transition-colors ${
                          isStudent && currentUser?.id === 'student-rohan' ? 'bg-[#F4EFE6] font-semibold text-[#1A1817]' : 'text-[#4A453D]'
                        }`}
                      >
                        <div>
                          <div className="font-medium">Rohan Gupta</div>
                          <div className="text-[11px] text-[#7A7265]">Student · Prerequisite equivalence gap</div>
                        </div>
                        <span className="text-[10px] font-mono text-[#C57D36] bg-[#FAF1E4] px-1.5 py-0.5 rounded">Prereq Gap</span>
                      </button>

                      <div className="border-t border-[#EFEAE2] my-1" />

                      <button
                        onClick={() => {
                          switchRole('teacher');
                          navigate('/teacher/dashboard');
                        }}
                        className={`w-full text-left px-3 py-2 rounded flex items-center justify-between hover:bg-[#FAF7F2] transition-colors ${
                          isTeacher ? 'bg-[#F4EFE6] font-semibold text-[#1A1817]' : 'text-[#4A453D]'
                        }`}
                      >
                        <div>
                          <div className="font-medium">Sunita Verma</div>
                          <div className="text-[11px] text-[#7A7265]">Mathematics Teacher · Class 7-B</div>
                        </div>
                        <span className="text-[10px] font-mono text-[#1B4332] bg-[#E8F0EC] px-1.5 py-0.5 rounded">Educator</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 text-[#5C5549] hover:text-[#1A1817] md:hidden"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Desktop Workspace Navigation Tabs */}
          <nav className="hidden md:flex items-center justify-between py-2 text-xs">
            <div className="flex items-center gap-1 sm:gap-2">
              {activeNav.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded transition-all ${
                      isActive
                        ? 'bg-[#1A1817] text-[#FAF7F2] font-semibold shadow-2xs'
                        : 'text-[#5C5549] hover:text-[#1A1817] hover:bg-[#EFE9DF]'
                    }`}
                  >
                    <span className={`font-mono text-[10px] ${isActive ? 'text-[#C57D36]' : 'text-[#8C8377]'}`}>
                      {item.num}
                    </span>
                    <span>{item.label}</span>
                    {item.badge && (
                      <span
                        className={`ml-0.5 px-1.5 py-0.2 rounded-full font-mono text-[10px] ${
                          isActive ? 'bg-[#C57D36] text-white' : 'bg-[#EAE4D8] text-[#5C5549]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Quick role indicator banner */}
            <div className="text-[11px] font-mono text-[#7D7569] flex items-center gap-2">
              <span>Workspace:</span>
              <span className="text-[#1A1817] font-semibold">
                {isTeacher ? 'Instructional Command Dossier' : 'Scholar Study Studio'}
              </span>
            </div>
          </nav>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E6DFD5] bg-[#FAF7F2] px-4 py-3 space-y-2">
            <div className="font-mono text-[10px] uppercase text-[#7A7265] tracking-wider px-2">
              {isTeacher ? 'Teacher Dossier Navigation' : 'Student Study Navigation'}
            </div>
            {activeNav.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded text-xs ${
                    isActive ? 'bg-[#1A1817] text-[#FAF7F2] font-semibold' : 'text-[#4A453D] hover:bg-[#EFE9DF]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-[#C57D36]">{item.num}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="font-mono text-[10px] bg-[#EAE4D8] text-[#1A1817] px-1.5 py-0.5 rounded">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-[#EAE3D6] flex flex-col gap-2">
              <Link
                to="/evaluation"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-semibold text-[#8C6239] bg-[#FAF1E4] rounded"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Engine Evidence Dossier</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Child Data Safety & DPDP Modal */}
      <PrivacyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />
    </>
  );
};
