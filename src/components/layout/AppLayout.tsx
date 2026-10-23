import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { UrgentHelpModal } from '../safety/UrgentHelpModal';

export const AppLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface text-on-surface">
      {/* Desktop Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-hidden relative">
        <Header onOpenHelp={() => setIsHelpOpen(true)} />

        <main className="flex-1 overflow-y-auto px-4 py-5 md:px-8 md:py-6 pt-20 pb-28 md:pb-8">
          <div className="max-w-4xl mx-auto w-full">
            <Outlet />
          </div>
        </main>

        {/* Mobile Navigation */}
        <BottomNav />
      </div>

      {/* Urgent Help Modal (always globally available) */}
      <UrgentHelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
};
