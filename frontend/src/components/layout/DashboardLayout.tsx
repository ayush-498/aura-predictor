import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Navbar } from './Navbar';
import { Sidebar, TabType } from './Sidebar';

interface DashboardLayoutProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  isBackendOnline: boolean | null;
  onRefreshHealth?: () => void;
  onNavigateToLanding?: () => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  activeTab,
  onSelectTab,
  isBackendOnline,
  onRefreshHealth,
  onNavigateToLanding,
  children,
}) => {
  // Start with collapsed for a clean, spacious dashboard
  const [collapsed, setCollapsed] = useState(true);
  const sidebarRef = useRef<HTMLElement | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastExpandedAt = useRef<number>(0);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const handleSelectTab = (tab: TabType) => {
    onSelectTab(tab);
    clearCloseTimer();
    setCollapsed(true);
  };

  const handleToggleCollapsed = () => {
    clearCloseTimer();
    setCollapsed(prev => {
      const next = !prev;
      if (!next) {
        lastExpandedAt.current = Date.now();
      }
      return next;
    });
  };

  const handleSidebarMouseEnter = () => {
    clearCloseTimer();
  };

  const handleSidebarMouseLeave = () => {
    if (collapsed) return;
    // Don't auto-close during the initial 350ms opening transition
    if (Date.now() - lastExpandedAt.current < 350) return;
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setCollapsed(true);
    }, 250);
  };

  // Close on mobile outside-click
  useEffect(() => {
    const handleDocumentPointerDown = (e: PointerEvent) => {
      if (collapsed) return;
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
          clearCloseTimer();
          setCollapsed(true);
        }
      }
    };

    document.addEventListener('pointerdown', handleDocumentPointerDown);
    return () => {
      document.removeEventListener('pointerdown', handleDocumentPointerDown);
      clearCloseTimer();
    };
  }, [collapsed, clearCloseTimer]);

  return (
    <div className="h-screen max-h-screen bg-zinc-50/50 dark:bg-zinc-950/25 backdrop-blur-[1px] text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200 overflow-hidden">
      <Navbar 
        isBackendOnline={isBackendOnline} 
        onRefreshHealth={onRefreshHealth} 
        onNavigateToLanding={onNavigateToLanding}
      />

      <div className="flex-1 flex overflow-hidden relative h-[calc(100vh-4rem)]">
        <Sidebar
          ref={sidebarRef}
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          collapsed={collapsed}
          onToggleCollapsed={handleToggleCollapsed}
          onMouseEnter={handleSidebarMouseEnter}
          onMouseLeave={handleSidebarMouseLeave}
        />

        <main 
          className="dashboard-main-content flex-1 overflow-y-auto h-full p-4 sm:p-8 transition-all duration-300"
        >
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
