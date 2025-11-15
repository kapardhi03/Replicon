import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangular',
  width,
  height,
  className = '',
  style,
  ...props
}) => {
  const baseStyles = 'animate-pulse bg-muted';

  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const combinedStyle = {
    width: width || undefined,
    height: height || (variant === 'text' ? '1rem' : undefined),
    ...style,
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={combinedStyle}
      {...props}
    />
  );
};

export interface SkeletonGroupProps {
  count?: number;
  children: React.ReactElement;
  className?: string;
}

const SkeletonGroup: React.FC<SkeletonGroupProps> = ({
  count = 3,
  children,
  className = '',
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }).map((_, index) =>
        React.cloneElement(children, { key: index })
      )}
    </div>
  );
};

// Pre-built skeleton patterns
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`border border-border rounded-lg p-6 ${className}`}>
    <Skeleton variant="text" className="w-3/4 mb-3" height="1.5rem" />
    <Skeleton variant="text" className="w-full mb-2" />
    <Skeleton variant="text" className="w-5/6 mb-4" />
    <Skeleton variant="rectangular" className="w-full" height="12rem" />
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; className?: string }> = ({
  rows = 5,
  className = '',
}) => (
  <div className={`space-y-3 ${className}`}>
    <Skeleton variant="rectangular" className="w-full" height="3rem" />
    {Array.from({ length: rows }).map((_, index) => (
      <Skeleton key={index} variant="rectangular" className="w-full" height="4rem" />
    ))}
  </div>
);

export { Skeleton, SkeletonGroup };
