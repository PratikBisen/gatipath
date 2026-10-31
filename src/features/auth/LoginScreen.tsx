import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth/AuthContext';
import {
  Sparkles,
  ArrowRight,
  GraduationCap,
  Users,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher'>('student');
  const [error, setError] = useState('');

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter a valid email address.');
      return;
    }

    const success = login(email, selectedRole);
    if (success) {
      if (selectedRole === 'teacher' || email.includes('teacher')) {
        navigate('/teacher/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } else {
      setError('Invalid credentials.');
    }
  };

  const handleDemoQuickLogin = (role: 'student' | 'teacher') => {
    if (role === 'student') {
      login('student@gatipath.demo', 'student');
      navigate('/student/dashboard');
    } else {
      login('teacher@gatipath.demo', 'teacher');
      navigate('/teacher/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8F5] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Wordmark & Icon */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary text-white font-bold text-2xl shadow-sm mb-3">
          G
        </div>
        <h1 className="text-3xl font-heading font-extrabold text-charcoal tracking-tight">
          GatiPath
        </h1>
        <p className="text-sm font-medium text-charcoal-muted mt-1">
          Learning that moves at your pace.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-borderSoft shadow-card space-y-6">
          {/* Quick 1-Click Demo Account Switcher */}
          <div className="p-4 bg-canvas rounded-xl border border-borderSoft space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-charcoal-muted uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Instant Hackathon Evaluation Access</span>
            </div>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Click either demo profile below to instantly experience GatiPath with realistic seeded records:
            </p>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => handleDemoQuickLogin('student')}
                className="p-3 bg-white rounded-lg border border-primary/30 hover:border-primary text-left transition-all hover:shadow-xs group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <GraduationCap className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold text-charcoal group-hover:text-primary">
                    Aarav (Student)
                  </span>
                </div>
                <p className="text-[11px] text-charcoal-muted truncate">
                  student@gatipath.demo
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleDemoQuickLogin('teacher')}
                className="p-3 bg-white rounded-lg border border-primary/30 hover:border-primary text-left transition-all hover:shadow-xs group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold text-charcoal group-hover:text-primary">
                    Sunita (Teacher)
                  </span>
                </div>
                <p className="text-[11px] text-charcoal-muted truncate">
                  teacher@gatipath.demo
                </p>
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-borderSoft" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-charcoal-muted font-semibold tracking-wider">
                Or Sign In Manually
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleFormLogin} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800">
                {error}
              </div>
            )}

            {/* Role Tab */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-canvas rounded-lg border border-borderSoft text-xs">
              <button
                type="button"
                onClick={() => setSelectedRole('student')}
                className={`py-2 rounded-md font-semibold transition-colors ${
                  selectedRole === 'student'
                    ? 'bg-white text-primary shadow-xs'
                    : 'text-charcoal-muted'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('teacher')}
                className={`py-2 rounded-md font-semibold transition-colors ${
                  selectedRole === 'teacher'
                    ? 'bg-white text-primary shadow-xs'
                    : 'text-charcoal-muted'
                }`}
              >
                Teacher
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={selectedRole === 'student' ? 'student@gatipath.demo' : 'teacher@gatipath.demo'}
                className="w-full p-2.5 text-xs rounded-lg border border-borderSoft bg-canvas text-charcoal focus:border-primary focus:bg-white outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 text-xs rounded-lg border border-borderSoft bg-canvas text-charcoal focus:border-primary focus:bg-white outline-none transition-colors"
              />
              <span className="block text-[11px] text-charcoal-muted mt-1">
                Any password accepted for demonstration mode.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center text-xs text-charcoal-muted">
          <p>Class 7 Mathematics Pilot · Fraction Arithmetic & Prerequisite Modeling</p>
        </div>
      </div>
    </div>
  );
};
