import React from 'react';
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = '',
      containerClassName = '',
      label,
      error,
      success,
      hint,
      leftIcon,
      rightIcon,
      type = 'text',
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    const baseStyles = 'w-full px-4 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed bg-background text-foreground';

    const stateStyles = error
      ? 'border-loss focus:ring-loss focus:border-loss'
      : success
      ? 'border-profit focus:ring-profit focus:border-profit'
      : 'border-border focus:ring-primary focus:border-primary';

    const hasLeftIcon = leftIcon || error || success;
    const hasRightIcon = rightIcon || isPassword;

    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label className="block text-sm font-medium mb-1.5 text-foreground">
            {label}
          </label>
        )}
        <div className="relative">
          {hasLeftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {error ? (
                <AlertCircle className="h-5 w-5 text-loss" />
              ) : success ? (
                <CheckCircle className="h-5 w-5 text-profit" />
              ) : (
                leftIcon
              )}
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            className={`${baseStyles} ${stateStyles} ${hasLeftIcon ? 'pl-10' : ''} ${hasRightIcon ? 'pr-10' : ''} ${className}`}
            disabled={disabled}
            {...props}
          />
          {hasRightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isPassword ? (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              ) : (
                rightIcon
              )}
            </div>
          )}
        </div>
        {(error || success || hint) && (
          <p
            className={`mt-1.5 text-sm ${
              error
                ? 'text-loss'
                : success
                ? 'text-profit'
                : 'text-muted-foreground'
            }`}
          >
            {error || success || hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
