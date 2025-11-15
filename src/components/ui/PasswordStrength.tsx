import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const requirements: PasswordRequirement[] = [
  { label: 'At least 8 characters', test: (pwd) => pwd.length >= 8 },
  { label: 'One uppercase letter', test: (pwd) => /[A-Z]/.test(pwd) },
  { label: 'One lowercase letter', test: (pwd) => /[a-z]/.test(pwd) },
  { label: 'One number', test: (pwd) => /\d/.test(pwd) },
  { label: 'One special character', test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) },
];

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password, className = '' }) => {
  const metRequirements = requirements.filter((req) => req.test(password));
  const strength = metRequirements.length;

  const getStrengthColor = () => {
    if (strength === 0) return 'bg-border';
    if (strength <= 2) return 'bg-loss';
    if (strength <= 4) return 'bg-yellow-500';
    return 'bg-profit';
  };

  const getStrengthLabel = () => {
    if (strength === 0) return '';
    if (strength <= 2) return 'Weak';
    if (strength <= 4) return 'Medium';
    return 'Strong';
  };

  return (
    <div className={className}>
      {/* Strength Bar */}
      <div className="flex gap-1 mb-3">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              index < strength ? getStrengthColor() : 'bg-border'
            }`}
          />
        ))}
      </div>

      {/* Strength Label */}
      {password && (
        <p className="text-sm font-medium mb-3">
          Password strength:{' '}
          <span
            className={
              strength <= 2
                ? 'text-loss'
                : strength <= 4
                ? 'text-yellow-500'
                : 'text-profit'
            }
          >
            {getStrengthLabel()}
          </span>
        </p>
      )}

      {/* Requirements List */}
      <div className="space-y-2">
        {requirements.map((req, index) => {
          const isMet = req.test(password);
          return (
            <div key={index} className="flex items-center gap-2 text-sm">
              {isMet ? (
                <Check className="h-4 w-4 text-profit flex-shrink-0" />
              ) : (
                <X className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
              <span className={isMet ? 'text-profit' : 'text-muted-foreground'}>
                {req.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PasswordStrength;
