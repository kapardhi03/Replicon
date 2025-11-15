import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { Button, Input, Card, CardContent, Modal } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import Container from '../components/layout/Container';
import { useToast } from '../components/ui/Toast';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const twoFASchema = z.object({
  code: z.string().length(6, '2FA code must be 6 digits'),
});

type TwoFAFormData = z.infer<typeof twoFASchema>;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginWith2FA } = useAuth();
  const { addToast } = useToast();
  const [show2FA, setShow2FA] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: register2FA,
    handleSubmit: handleSubmit2FA,
    formState: { errors: errors2FA, isSubmitting: isSubmitting2FA },
  } = useForm<TwoFAFormData>({
    resolver: zodResolver(twoFASchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      addToast({
        type: 'success',
        title: 'Login Successful',
        message: 'Welcome back to Replicon!',
      });
      navigate('/master/dashboard');
    } catch (error: any) {
      if (error.message === '2FA_REQUIRED') {
        setShow2FA(true);
      } else {
        addToast({
          type: 'error',
          title: 'Login Failed',
          message: error.message || 'Invalid email or password',
        });
      }
    }
  };

  const onSubmit2FA = async (data: TwoFAFormData) => {
    try {
      await loginWith2FA(data.code);
      setShow2FA(false);
      addToast({
        type: 'success',
        title: 'Login Successful',
        message: 'Welcome back to Replicon!',
      });
      navigate('/master/dashboard');
    } catch (error: any) {
      addToast({
        type: 'error',
        title: '2FA Verification Failed',
        message: error.message || 'Invalid verification code',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 py-12 px-4">
      <Container size="sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="text-2xl font-heading font-bold text-foreground">Replicon</span>
          </Link>
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-foreground">
            Sign in to your Master Trader account
          </p>
        </div>

        <Card padding="lg">
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                leftIcon={<Mail className="h-5 w-5" />}
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                leftIcon={<Lock className="h-5 w-5" />}
                error={errors.password?.message}
                {...register('password')}
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                    {...register('rememberMe')}
                  />
                  <span className="text-sm text-muted-foreground">Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary hover:underline font-medium">
                  Create Account
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>By signing in, you agree to our</p>
          <div className="mt-1">
            <Link to="/terms" className="text-primary hover:underline">
              Terms & Conditions
            </Link>
            {' and '}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </Container>

      {/* 2FA Modal */}
      <Modal
        isOpen={show2FA}
        onClose={() => setShow2FA(false)}
        title="Two-Factor Authentication"
        description="Enter the 6-digit code from your authenticator app"
      >
        <form onSubmit={handleSubmit2FA(onSubmit2FA)} className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Check your authenticator app for the verification code
            </p>
          </div>

          <Input
            label="Verification Code"
            placeholder="000000"
            maxLength={6}
            error={errors2FA.code?.message}
            className="text-center text-2xl font-mono tracking-widest"
            {...register2FA('code')}
          />

          <div className="flex gap-3">
            <Button
              type="button"
              variant="ghost"
              className="flex-1"
              onClick={() => setShow2FA(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" isLoading={isSubmitting2FA}>
              Verify
            </Button>
          </div>
        </form>
      </Modal>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </div>
  );
};

// Forgot Password Modal Component
const ForgotPasswordModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { resetPassword } = useAuth();
  const { addToast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const forgotPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
  });

  type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    try {
      await resetPassword(data.email);
      setIsSubmitted(true);
      addToast({
        type: 'success',
        title: 'Reset Link Sent',
        message: 'Check your email for password reset instructions',
      });
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Request Failed',
        message: error.message || 'Failed to send reset link',
      });
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Reset Password"
      description={
        !isSubmitted
          ? "Enter your email address and we'll send you a password reset link"
          : undefined
      }
    >
      {!isSubmitted ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            leftIcon={<Mail className="h-5 w-5" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <div className="flex gap-3">
            <Button type="button" variant="ghost" className="flex-1" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" isLoading={isSubmitting}>
              Send Reset Link
            </Button>
          </div>
        </form>
      ) : (
        <div className="text-center py-4">
          <div className="h-16 w-16 rounded-full bg-profit/10 flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-profit" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Check your email</h3>
          <p className="text-sm text-muted-foreground mb-6">
            We've sent password reset instructions to your email address.
          </p>
          <Button onClick={handleClose} className="w-full">
            Got it
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default LoginPage;
