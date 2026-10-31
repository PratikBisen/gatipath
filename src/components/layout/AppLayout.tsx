import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { MobileNav } from './MobileNav';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas flex flex-col antialiased">
      {/* Sidebar (Desktop Persistent / Mobile Slide-over) */}
      <Sidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Column (offset by 256px on desktop) */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        <TopHeader onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />

        <main className="flex-1 pb-20 lg:pb-12">
          {children}
        </main>

        <MobileNav />
      </div>
    </div>
  );
};
