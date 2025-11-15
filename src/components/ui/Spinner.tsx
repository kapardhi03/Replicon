import React from 'react';
import { Loader2 } from 'lucide-react';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  label?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '', label }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Loader2 className={`animate-spin text-primary ${sizes[size]} ${className}`} />
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );
};

export default Spinner;
