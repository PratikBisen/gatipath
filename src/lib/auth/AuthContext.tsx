import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, Student, Teacher } from '../../types';
import { db } from '../db';

interface AuthContextType {
  currentUser: Student | Teacher | null;
  currentRole: Role | null;
  login: (email: string, role?: Role) => boolean;
  logout: () => void;
  switchRole: (role: Role, studentId?: string) => void;
  isAuthenticated: boolean;
  isStudent: boolean;
  isTeacher: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'gatipath_auth_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Student | Teacher | null>(null);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const { role, id } = JSON.parse(stored);
        if (role === 'teacher') {
          setCurrentUser(db.getTeacher());
          setCurrentRole('teacher');
        } else if (role === 'student') {
          const student = db.getStudent(id) || db.getStudents()[0];
          setCurrentUser(student);
          setCurrentRole('student');
        }
      } else {
        // Default to student (Aarav) for instant frictionless evaluation
        const defaultStudent = db.getStudents()[0];
        setCurrentUser(defaultStudent);
        setCurrentRole('student');
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ role: 'student', id: defaultStudent.id }));
      }
    } catch (e) {
      const defaultStudent = db.getStudents()[0];
      setCurrentUser(defaultStudent);
      setCurrentRole('student');
    }
  }, []);

  const login = (email: string, requestedRole?: Role): boolean => {
    const cleanEmail = email.trim().toLowerCase();

    if (requestedRole === 'teacher' || cleanEmail.includes('teacher')) {
      const teacher = db.getTeacher();
      setCurrentUser(teacher);
      setCurrentRole('teacher');
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ role: 'teacher', id: teacher.id }));
      return true;
    }

    const students = db.getStudents();
    const match = students.find(s => s.email.toLowerCase() === cleanEmail) || students[0];
    setCurrentUser(match);
    setCurrentRole('student');
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ role: 'student', id: match.id }));
    return true;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setCurrentUser(null);
    setCurrentRole(null);
  };

  const switchRole = (role: Role, studentId?: string) => {
    if (role === 'teacher') {
      const teacher = db.getTeacher();
      setCurrentUser(teacher);
      setCurrentRole('teacher');
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ role: 'teacher', id: teacher.id }));
    } else {
      const student = studentId ? db.getStudent(studentId) || db.getStudents()[0] : db.getStudents()[0];
      setCurrentUser(student);
      setCurrentRole('student');
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ role: 'student', id: student.id }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        login,
        logout,
        switchRole,
        isAuthenticated: !!currentUser,
        isStudent: currentRole === 'student',
        isTeacher: currentRole === 'teacher',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
