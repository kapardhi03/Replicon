import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  showHome = true,
  className = '',
}) => {
  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`}>
      {showHome && (
        <>
          <Link
            to="/"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4" />
          </Link>
          {items.length > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
        </>
      )}

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {item.href && !isLast ? (
              <Link
                to={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                {item.label}
              </span>
            )}
            {!isLast && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
