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
  const autoCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAutoCloseTimer = useCallback(() => {
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
  }, []);

  const scheduleAutoClose = useCallback((delayMs = 450) => {
    clearAutoCloseTimer();
    autoCloseTimerRef.current = setTimeout(() => {
      setCollapsed(true);
    }, delayMs);
  }, [clearAutoCloseTimer]);

  const handleSelectTab = (tab: TabType) => {
    onSelectTab(tab);
    // Automatically close sidebar when any navigation tab is clicked
    clearAutoCloseTimer();
    setCollapsed(true);
  };

  const handleToggleCollapsed = () => {
    clearAutoCloseTimer();
    setCollapsed(prev => {
      const next = !prev;
      // If opening the sidebar, schedule an inactivity auto-close timer
      if (!next) {
        autoCloseTimerRef.current = setTimeout(() => {
          setCollapsed(true);
        }, 6000);
      }
      return next;
    });
  };

  // Close sidebar automatically when cursor leaves the sidebar
  const handleSidebarMouseLeave = () => {
    if (!collapsed) {
      scheduleAutoClose(450);
    }
  };

  // Keep open while user is hovering or interacting inside sidebar
  const handleSidebarMouseEnter = () => {
    clearAutoCloseTimer();
  };

  // Auto-close sidebar immediately when user scrolls dashboard content
  const handleMainScroll = () => {
    if (!collapsed) {
      clearAutoCloseTimer();
      setCollapsed(true);
    }
  };

  // Global outside-click and scroll auto-closing listeners
  useEffect(() => {
    const handleDocumentPointerDown = (e: PointerEvent) => {
      if (collapsed) return;
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        clearAutoCloseTimer();
        setCollapsed(true);
      }
    };

    const handleWindowScroll = () => {
      if (!collapsed) {
        clearAutoCloseTimer();
        setCollapsed(true);
      }
    };

    document.addEventListener('pointerdown', handleDocumentPointerDown);
    window.addEventListener('scroll', handleWindowScroll, { passive: true });

    return () => {
      document.removeEventListener('pointerdown', handleDocumentPointerDown);
      window.removeEventListener('scroll', handleWindowScroll);
      clearAutoCloseTimer();
    };
  }, [collapsed, clearAutoCloseTimer]);

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
          onClick={() => {
            // Auto-close sidebar if user clicks into main content while sidebar is expanded
            if (!collapsed) {
              clearAutoCloseTimer();
              setCollapsed(true);
            }
          }}
          onScroll={handleMainScroll}
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
