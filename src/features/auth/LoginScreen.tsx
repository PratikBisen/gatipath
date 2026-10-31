import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth/AuthContext';
import {
  Sparkles,
  ArrowRight,
  GraduationCap,
  Users,
  ShieldCheck,
  Check
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
    setError('');
    if (!email.trim()) {
      setError('Please enter a valid email address.');
      return;
    }

    const success = login(email, selectedRole, password);
    if (success) {
      if (selectedRole === 'teacher' || email.includes('teacher')) {
        navigate('/teacher/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } else {
      setError('Unrecognized credentials. For evaluation, select one-click demo access or use student@gatipath.demo / teacher@gatipath.demo.');
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
    <div className="min-h-screen bg-[#FBF9F5] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        {/* Brand Monogram */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#1A1817] text-[#FAF7F2] font-editorial font-bold text-2xl shadow-xs">
          G
        </div>
        <h1 className="text-3xl sm:text-4xl font-editorial font-bold text-[#1A1817] tracking-tight">
          GĀTIPATH
        </h1>
        <p className="text-xs uppercase font-mono tracking-widest text-[#7A7265]">
          Adaptive Learning Atelier · Indian School Mathematics
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-xl border border-[#E0D8CC] shadow-xs space-y-6">
          {/* Quick Demo Evaluation Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#7A7265] pb-2 border-b border-[#EFEAE2]">
              <span>Instant Demonstration Access</span>
              <span className="text-[#1B4332] font-bold">1-Click</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleDemoQuickLogin('student')}
                className="p-3.5 rounded-lg border border-[#DCD5C9] bg-[#FAF7F2] hover:bg-[#F2EDE4] text-left transition-all group"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-[#1A1817] group-hover:text-[#1B4332]">
                  <GraduationCap className="w-4 h-4 text-[#1B4332]" />
                  <span>Student</span>
                </div>
                <div className="text-[11px] text-[#5C5549] mt-1 font-mono">
                  Aarav Sharma
                </div>
                <div className="text-[10px] text-[#8C8377] mt-0.5">
                  Class 7 Fractions
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoQuickLogin('teacher')}
                className="p-3.5 rounded-lg border border-[#DCD5C9] bg-[#FAF7F2] hover:bg-[#F2EDE4] text-left transition-all group"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-[#1A1817] group-hover:text-[#1B4332]">
                  <Users className="w-4 h-4 text-[#1B4332]" />
                  <span>Teacher</span>
                </div>
                <div className="text-[11px] text-[#5C5549] mt-1 font-mono">
                  Sunita Verma
                </div>
                <div className="text-[10px] text-[#8C8377] mt-0.5">
                  Class 7-B Command
                </div>
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E8E2D8]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-[#8C8377] font-mono text-[11px]">or sign in with credentials</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleFormLogin} className="space-y-4 text-xs">
            {error && (
              <div className="p-3 bg-[#FFF5F5] border border-[#FCD4D4] rounded-lg text-xs text-[#8C2828]">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[11px] font-mono uppercase text-[#7A7265] font-semibold mb-1">
                Account Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. student@gatipath.demo"
                className="w-full p-2.5 rounded border border-[#DCD5C9] bg-white text-[#1A1817] focus:outline-none focus:border-[#1A1817]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-[#7A7265] font-semibold mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 rounded border border-[#DCD5C9] bg-white text-[#1A1817] focus:outline-none focus:border-[#1A1817]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-[#1B4332] text-white hover:bg-[#112F23] font-semibold text-xs shadow-xs transition-all"
            >
              Sign In to Workspace
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
