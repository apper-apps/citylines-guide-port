import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/api/authService';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';

const VerifyEmailPage = () => {
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error', 'pending'
  const [isResending, setIsResending] = useState(false);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const { verifyEmail } = useAuth();
  const token = searchParams.get('token');
  const email = location.state?.email;

  useEffect(() => {
    if (token) {
      handleVerification(token);
    } else if (!email) {
      // No token and no email, redirect to signup
      navigate('/auth/signup');
    } else {
      // No token but have email, show pending verification
      setStatus('pending');
    }
  }, [token, email, navigate]);

  const handleVerification = async (verificationToken) => {
    try {
      await verifyEmail(verificationToken);
      setStatus('success');
      // Redirect to dashboard after a delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      setStatus('error');
    }
  };

  const handleResendVerification = async () => {
    if (!email) return;
    
    setIsResending(true);
    try {
      await authService.resendVerificationEmail(email);
      // Show success message without changing status
    } catch (error) {
      // Error is handled by the auth service with toast
    } finally {
      setIsResending(false);
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
              <ApperIcon name="Loader2" className="w-6 h-6 text-blue-600 animate-spin" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Verifying your email
            </h3>
            <p className="text-sm text-gray-600">
              Please wait while we verify your email address...
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
              <ApperIcon name="CheckCircle" className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Email verified successfully!
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Your account has been verified. Redirecting to dashboard...
            </p>
            <div className="flex items-center justify-center">
              <ApperIcon name="Loader2" className="w-4 h-4 animate-spin mr-2" />
              <span className="text-sm text-gray-500">Redirecting...</span>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
              <ApperIcon name="XCircle" className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Verification failed
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              The verification link is invalid or has expired. Please request a new verification email.
            </p>
            <div className="space-y-3">
              {email && (
                <Button
                  onClick={handleResendVerification}
                  disabled={isResending}
                  className="w-full"
                >
                  {isResending ? (
                    <>
                      <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Resend verification email'
                  )}
                </Button>
              )}
              <Link to="/auth/signup">
                <Button variant="outline" className="w-full">
                  Back to signup
                </Button>
              </Link>
            </div>
          </div>
        );

      case 'pending':
        return (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 mb-4">
              <ApperIcon name="Mail" className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Check your email
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              We've sent a verification link to {email}. Click the link in the email to verify your account.
            </p>
            <div className="space-y-3">
              <Button
                onClick={handleResendVerification}
                disabled={isResending}
                variant="outline"
                className="w-full"
              >
                {isResending ? (
                  <>
                    <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Resend verification email'
                )}
              </Button>
              <Link to="/auth/login">
                <Button variant="ghost" className="w-full">
                  Back to sign in
                </Button>
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-surface flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <ApperIcon name="Train" className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-gray-900">CityLines Guide</span>
          </div>
        </div>

        <Card>
          {renderContent()}
        </Card>
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;