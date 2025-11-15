import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  BarChart3,
  CreditCard,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const masterNavItems: NavItem[] = [
  { name: 'Dashboard', href: '/master/dashboard', icon: LayoutDashboard },
  { name: 'Followers', href: '/master/followers', icon: Users },
  { name: 'Strategies', href: '/master/strategies', icon: TrendingUp },
  { name: 'Analytics', href: '/master/analytics', icon: BarChart3 },
  { name: 'Transactions', href: '/master/transactions', icon: CreditCard },
];

const bottomNavItems: NavItem[] = [
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Support', href: '/support', icon: HelpCircle },
];

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed = false,
  onToggleCollapse,
  isMobile = false,
  onClose,
}) => {
  const location = useLocation();

  const isActive = (href: string) => location.pathname === href;

  const NavLink: React.FC<{ item: NavItem }> = ({ item }) => {
    const Icon = item.icon;
    const active = isActive(item.href);

    return (
      <Link
        to={item.href}
        onClick={isMobile ? onClose : undefined}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
          active
            ? 'bg-primary text-white'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        }`}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        {!isCollapsed && <span className="text-sm font-medium">{item.name}</span>}
      </Link>
    );
  };

  return (
    <aside
      className={`${
        isMobile ? 'fixed inset-y-0 left-0 z-50' : 'sticky top-16 h-[calc(100vh-4rem)]'
      } bg-background border-r border-border transition-all duration-300 ${
        isCollapsed && !isMobile ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {/* Main Navigation */}
          <div className="space-y-1">
            {masterNavItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>

          {/* Divider */}
          <div className="my-4 border-t border-border" />

          {/* Bottom Navigation */}
          <div className="space-y-1">
            {bottomNavItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>
        </nav>

        {/* Collapse Toggle Button (Desktop only) */}
        {!isMobile && onToggleCollapse && (
          <div className="p-4 border-t border-border">
            <button
              onClick={onToggleCollapse}
              className="flex items-center justify-center w-full p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <>
                  <ChevronLeft className="h-5 w-5" />
                  <span className="ml-2 text-sm">Collapse</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
