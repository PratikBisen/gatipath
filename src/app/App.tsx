import React from 'react';
import { HashRouter } from 'react-router-dom';
import { AuthProvider } from '../lib/auth/AuthContext';
import { AppRoutes } from './routes';

export const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </HashRouter>
  );
};
