import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import { Transition } from '@headlessui/react';

interface MainLayoutProps {
  children: React.ReactNode;
  isAuthenticated?: boolean;
  showSidebar?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  isAuthenticated = false,
  showSidebar = false,
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleCloseMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar
        onMenuClick={handleMenuClick}
        isAuthenticated={isAuthenticated}
      />

      {/* Main Content Area */}
      <div className="flex">
        {/* Desktop Sidebar */}
        {showSidebar && isAuthenticated && (
          <div className="hidden lg:block">
            <Sidebar
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
          </div>
        )}

        {/* Mobile Sidebar Overlay */}
        {showSidebar && isAuthenticated && (
          <>
            <Transition
              show={isMobileSidebarOpen}
              as={React.Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={handleCloseMobileSidebar}
              />
            </Transition>

            <Transition
              show={isMobileSidebarOpen}
              as={React.Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <div className="lg:hidden">
                <Sidebar
                  isMobile={true}
                  onClose={handleCloseMobileSidebar}
                />
              </div>
            </Transition>
          </>
        )}

        {/* Main Content */}
        <main className={`flex-1 ${showSidebar && isAuthenticated ? 'lg:pb-0 pb-16' : ''}`}>
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {showSidebar && isAuthenticated && (
        <MobileNav onMenuClick={handleMenuClick} />
      )}
    </div>
  );
};

export default MainLayout;
