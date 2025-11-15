import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Bell, User, LogOut, Settings } from 'lucide-react';
import { Menu as HeadlessMenu, Transition } from '@headlessui/react';
import Button from '../ui/Button';

interface NavbarProps {
  onMenuClick?: () => void;
  isAuthenticated?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, isAuthenticated = false }) => {
  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left side - Logo and Menu */}
          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <button
                onClick={onMenuClick}
                className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>
            )}
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="text-xl font-heading font-bold text-foreground">
                Replicon
              </span>
            </Link>
          </div>

          {/* Right side - Navigation items */}
          <div className="flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            ) : (
              <>
                {/* Notifications */}
                <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-loss" />
                </button>

                {/* User Menu */}
                <HeadlessMenu as="div" className="relative">
                  <HeadlessMenu.Button className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  </HeadlessMenu.Button>

                  <Transition
                    as={React.Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <HeadlessMenu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-background border border-border shadow-lg focus:outline-none">
                      <div className="p-1">
                        <HeadlessMenu.Item>
                          {({ active }) => (
                            <Link
                              to="/settings"
                              className={`${
                                active ? 'bg-muted' : ''
                              } flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition-colors`}
                            >
                              <Settings className="h-4 w-4" />
                              Settings
                            </Link>
                          )}
                        </HeadlessMenu.Item>
                        <HeadlessMenu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active ? 'bg-muted' : ''
                              } flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-loss transition-colors`}
                            >
                              <LogOut className="h-4 w-4" />
                              Logout
                            </button>
                          )}
                        </HeadlessMenu.Item>
                      </div>
                    </HeadlessMenu.Items>
                  </Transition>
                </HeadlessMenu>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
