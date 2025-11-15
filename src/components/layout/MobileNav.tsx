import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  BarChart3,
  Menu,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const mobileNavItems: NavItem[] = [
  { name: 'Dashboard', href: '/master/dashboard', icon: LayoutDashboard },
  { name: 'Followers', href: '/master/followers', icon: Users },
  { name: 'Strategies', href: '/master/strategies', icon: TrendingUp },
  { name: 'Analytics', href: '/master/analytics', icon: BarChart3 },
];

interface MobileNavProps {
  onMenuClick?: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ onMenuClick }) => {
  const location = useLocation();

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-background border-t border-border">
      <div className="grid grid-cols-5 h-16">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                active
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{item.name}</span>
            </Link>
          );
        })}

        <button
          onClick={onMenuClick}
          className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Menu className="h-5 w-5" />
          <span className="text-xs">More</span>
        </button>
      </div>
    </nav>
  );
};

export default MobileNav;
