import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { verifyEmail, resendVerification } from '../services/auth.api';
import { validateEmail } from '../utils/validation';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [resendError, setResendError] = useState(null);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const hasCalled = useRef(false);

  useEffect(() => {
    if (!token || hasCalled.current) return;
    hasCalled.current = true;

    const verify = async () => {
      try {
        const response = await verifyEmail(token);
        setSuccess(true);
        setMessage(response.data?.message || 'Email verified successfully!');
        toast.success('Email verified successfully!');
      } catch (err) {
        setSuccess(false);
        setMessage(
          err.response?.data?.message ||
            'The verification link is invalid, has expired, or has already been used.'
        );
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token]);

  const handleResend = async (e) => {
    e.preventDefault();
    const emailErr = validateEmail(resendEmail);
    if (emailErr) {
      setResendError(emailErr);
      return;
    }

    setResending(true);
    try {
      await resendVerification({ email: resendEmail });
      setResendSuccess(true);
      toast.success('Verification email sent! Please check your inbox.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to resend verification email.';
      toast.error(msg);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {loading ? (
          <div>
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900">Verifying Email...</h2>
            <p className="mt-2 text-gray-600">Please wait while we verify your email address.</p>
          </div>
        ) : success ? (
          <div>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Verification Complete!</h2>
            <p className="mt-2 text-gray-600 mb-6">{message}</p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Sign In to Your Account
            </Link>
          </div>
        ) : (
          <div>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Verification Failed</h2>
            <p className="mt-2 text-gray-600 mb-6">{message}</p>

            {resendSuccess ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm mb-6">
                A new verification email has been dispatched to <strong>{resendEmail}</strong>.
              </div>
            ) : (
              <form onSubmit={handleResend} noValidate className="space-y-4 text-left">
                <p className="text-sm font-medium text-gray-700">Need a new verification link?</p>
                <div>
                  <label htmlFor="resend-email" className="sr-only">Email address</label>
                  <input
                    id="resend-email"
                    type="email"
                    value={resendEmail}
                    onChange={(e) => {
                      setResendEmail(e.target.value);
                      if (resendError) setResendError(null);
                    }}
                    placeholder="Enter your email address"
                    className={`w-full px-4 py-2.5 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm ${
                      resendError ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {resendError && <p className="mt-1 text-xs text-red-500">{resendError}</p>}
                </div>

                <button
                  type="submit"
                  disabled={resending}
                  className="w-full flex items-center justify-center px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  {resending ? 'Sending...' : 'Resend Verification Email'}
                </button>
              </form>
            )}

            <div className="mt-6">
              <Link to="/login" className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">
                ← Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
