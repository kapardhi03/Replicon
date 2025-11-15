import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Phone, Lock, TrendingUp, Users, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button, Input, Card, CardContent } from '../components/ui';
import Container from '../components/layout/Container';
import ProgressSteps from '../components/ui/ProgressSteps';
import PasswordStrength from '../components/ui/PasswordStrength';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';

const steps = [
  { id: 1, title: 'Account Type', description: 'Choose your role' },
  { id: 2, title: 'Personal Info', description: 'Basic details' },
  { id: 3, title: 'Security', description: 'Set password' },
  { id: 4, title: 'Review', description: 'Confirm details' },
];

// Step 1: Account Type Selection
const accountTypeSchema = z.object({
  role: z.enum(['master', 'follower'], {
    required_error: 'Please select an account type',
  }),
});

// Step 2: Personal Information
const personalInfoSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^[+]?[0-9]{10,15}$/, 'Please enter a valid phone number'),
});

// Step 3: Security
const securitySchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/\d/, 'Password must contain at least one number')
      .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type AccountTypeData = z.infer<typeof accountTypeSchema>;
type PersonalInfoData = z.infer<typeof personalInfoSchema>;
type SecurityData = z.infer<typeof securitySchema>;

type RegistrationData = AccountTypeData & PersonalInfoData & SecurityData;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const { addToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<RegistrationData>>({});

  const goToNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinalSubmit = async () => {
    try {
      const completeData = formData as RegistrationData;
      await registerUser({
        name: completeData.name,
        email: completeData.email,
        phone: completeData.phone,
        password: completeData.password,
        role: completeData.role,
      });

      addToast({
        type: 'success',
        title: 'Account Created Successfully!',
        message: 'Welcome to Replicon. Please check your email for verification.',
      });

      navigate('/onboarding');
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Registration Failed',
        message: error.message || 'An error occurred during registration',
      });
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4">
      <Container size="md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="text-2xl font-heading font-bold text-foreground">Replicon</span>
          </Link>
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
            Create Your Account
          </h1>
          <p className="text-muted-foreground">
            Join the ultra-fast copy trading platform
          </p>
        </div>

        {/* Progress Steps */}
        <ProgressSteps steps={steps} currentStep={currentStep} className="mb-8" />

        {/* Step Content */}
        <Card padding="lg">
          <CardContent>
            {currentStep === 1 && (
              <Step1AccountType
                formData={formData}
                setFormData={setFormData}
                onNext={goToNextStep}
              />
            )}
            {currentStep === 2 && (
              <Step2PersonalInfo
                formData={formData}
                setFormData={setFormData}
                onNext={goToNextStep}
                onBack={goToPreviousStep}
              />
            )}
            {currentStep === 3 && (
              <Step3Security
                formData={formData}
                setFormData={setFormData}
                onNext={goToNextStep}
                onBack={goToPreviousStep}
              />
            )}
            {currentStep === 4 && (
              <Step4Review
                formData={formData as RegistrationData}
                onBack={goToPreviousStep}
                onSubmit={handleFinalSubmit}
              />
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Sign In
          </Link>
        </div>
      </Container>
    </div>
  );
};

// Step 1: Account Type Selection
const Step1AccountType: React.FC<{
  formData: Partial<RegistrationData>;
  setFormData: (data: Partial<RegistrationData>) => void;
  onNext: () => void;
}> = ({ formData, setFormData, onNext }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<AccountTypeData>({
    resolver: zodResolver(accountTypeSchema),
    defaultValues: { role: formData.role },
  });

  const selectedRole = watch('role');

  const onSubmit = (data: AccountTypeData) => {
    setFormData({ ...formData, ...data });
    onNext();
  };

  const accountTypes = [
    {
      value: 'master' as const,
      title: 'Master Trader',
      description: 'Manage followers and replicate your trades',
      icon: TrendingUp,
      features: [
        'Add and manage up to 500+ followers',
        'Create multiple trading strategies',
        'Advanced analytics and reporting',
        'Full risk management controls',
      ],
    },
    {
      value: 'follower' as const,
      title: 'Follower',
      description: 'Follow expert traders automatically',
      icon: Users,
      features: [
        'Copy trades from master traders',
        'Automated order execution',
        'Real-time trade updates',
        'Customizable position sizing',
      ],
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
          Choose Your Account Type
        </h2>
        <p className="text-muted-foreground">
          Select the role that best describes your trading needs
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {accountTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedRole === type.value;

          return (
            <label key={type.value} className="cursor-pointer">
              <input
                type="radio"
                value={type.value}
                {...register('role')}
                className="sr-only"
              />
              <div
                className={`relative border-2 rounded-lg p-6 transition-all duration-200 ${
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-heading font-bold text-foreground">
                      {type.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </div>
                </div>

                <ul className="space-y-2">
                  {type.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {isSelected && (
                  <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {errors.role && (
        <p className="text-sm text-loss">{errors.role.message}</p>
      )}

      <div className="flex justify-end">
        <Button type="submit" rightIcon={<ChevronRight className="h-5 w-5" />}>
          Continue
        </Button>
      </div>
    </form>
  );
};

// Step 2: Personal Information
const Step2PersonalInfo: React.FC<{
  formData: Partial<RegistrationData>;
  setFormData: (data: Partial<RegistrationData>) => void;
  onNext: () => void;
  onBack: () => void;
}> = ({ formData, setFormData, onNext, onBack }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalInfoData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
    },
  });

  const onSubmit = (data: PersonalInfoData) => {
    setFormData({ ...formData, ...data });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
          Personal Information
        </h2>
        <p className="text-muted-foreground">
          Tell us a bit about yourself
        </p>
      </div>

      <Input
        label="Full Name"
        placeholder="John Doe"
        leftIcon={<User className="h-5 w-5" />}
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        leftIcon={<Mail className="h-5 w-5" />}
        error={errors.email?.message}
        hint="We'll send a verification email to this address"
        {...register('email')}
      />

      <Input
        label="Phone Number"
        type="tel"
        placeholder="+91 98765 43210"
        leftIcon={<Phone className="h-5 w-5" />}
        error={errors.phone?.message}
        hint="Include country code (e.g., +91 for India)"
        {...register('phone')}
      />

      <div className="flex gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          leftIcon={<ChevronLeft className="h-5 w-5" />}
        >
          Back
        </Button>
        <Button type="submit" className="flex-1" rightIcon={<ChevronRight className="h-5 w-5" />}>
          Continue
        </Button>
      </div>
    </form>
  );
};

// Step 3: Security
const Step3Security: React.FC<{
  formData: Partial<RegistrationData>;
  setFormData: (data: Partial<RegistrationData>) => void;
  onNext: () => void;
  onBack: () => void;
}> = ({ formData, setFormData, onNext, onBack }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SecurityData>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      acceptTerms: formData.acceptTerms,
    },
  });

  const password = watch('password', '');

  const onSubmit = (data: SecurityData) => {
    setFormData({ ...formData, ...data });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
          Secure Your Account
        </h2>
        <p className="text-muted-foreground">
          Create a strong password to protect your account
        </p>
      </div>

      <Input
        label="Password"
        type="password"
        placeholder="Create a strong password"
        leftIcon={<Lock className="h-5 w-5" />}
        error={errors.password?.message}
        {...register('password')}
      />

      {password && (
        <PasswordStrength password={password} className="bg-muted/50 p-4 rounded-lg" />
      )}

      <Input
        label="Confirm Password"
        type="password"
        placeholder="Re-enter your password"
        leftIcon={<Lock className="h-5 w-5" />}
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <div>
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
            {...register('acceptTerms')}
          />
          <span className="text-sm text-muted-foreground">
            I agree to the{' '}
            <Link
              to="/terms"
              target="_blank"
              className="text-primary hover:underline"
            >
              Terms and Conditions
            </Link>{' '}
            and{' '}
            <Link
              to="/privacy"
              target="_blank"
              className="text-primary hover:underline"
            >
              Privacy Policy
            </Link>
          </span>
        </label>
        {errors.acceptTerms && (
          <p className="text-sm text-loss mt-1">{errors.acceptTerms.message}</p>
        )}
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          leftIcon={<ChevronLeft className="h-5 w-5" />}
        >
          Back
        </Button>
        <Button type="submit" className="flex-1" rightIcon={<ChevronRight className="h-5 w-5" />}>
          Continue
        </Button>
      </div>
    </form>
  );
};

// Step 4: Review
const Step4Review: React.FC<{
  formData: RegistrationData;
  onBack: () => void;
  onSubmit: () => void;
}> = ({ formData, onBack, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
          Review Your Information
        </h2>
        <p className="text-muted-foreground">
          Please verify your details before creating your account
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-muted/50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Account Type</h3>
          <p className="text-foreground font-medium capitalize">{formData.role} Trader</p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Personal Information</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Name:</span>
              <span className="text-sm font-medium text-foreground">{formData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Email:</span>
              <span className="text-sm font-medium text-foreground">{formData.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Phone:</span>
              <span className="text-sm font-medium text-foreground">{formData.phone}</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-foreground">
            <strong>Next Steps:</strong> After creating your account, you'll need to:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li>• Verify your email address</li>
            <li>• Complete your profile setup</li>
            <li>• Connect your IIFL API credentials</li>
          </ul>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          leftIcon={<ChevronLeft className="h-5 w-5" />}
        >
          Back
        </Button>
        <Button
          type="button"
          className="flex-1"
          onClick={handleSubmit}
          isLoading={isSubmitting}
        >
          Create Account
        </Button>
      </div>
    </div>
  );
};

export default RegisterPage;
