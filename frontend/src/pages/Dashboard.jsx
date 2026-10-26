import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resendVerification } from '../services/auth.api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [resending, setResending] = useState(false);

  const getInitials = (username) => {
    if (!username) return '?';
    return username.charAt(0).toUpperCase();
  };

  const handleResendVerification = async () => {
    setResending(true);
    try {
      await resendVerification({ email: user?.email });
      toast.success('Verification email sent! Check your inbox.');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to resend verification email.';
      toast.error(message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, <span className="text-indigo-600">{user?.username}</span>!
          </h1>
          <p className="mt-1 text-gray-600">Here&apos;s an overview of your account.</p>
        </div>

        {/* Verification Banner */}
        {user && !user.isVerified && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-yellow-800">
                Your email is not verified. Please verify to access all features.
              </span>
            </div>
            <button
              type="button"
              onClick={handleResendVerification}
              disabled={resending}
              className="px-4 py-2 bg-yellow-500 text-white text-sm font-medium rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            >
              {resending ? 'Sending...' : 'Resend Verification'}
            </button>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-4">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">{getInitials(user?.username)}</span>
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{user?.username}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                  user?.isVerified
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {user?.isVerified ? '✓ Verified' : '⚠ Unverified'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/profile/edit"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow group"
          >
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-indigo-200 transition-colors">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h4 className="text-sm font-semibold text-gray-900">Edit Profile</h4>
            <p className="text-xs text-gray-500 mt-1">Update your personal information</p>
          </Link>

          <Link
            to="/change-password"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow group"
          >
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-green-200 transition-colors">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h4 className="text-sm font-semibold text-gray-900">Change Password</h4>
            <p className="text-xs text-gray-500 mt-1">Update your password for security</p>
          </Link>

          <Link
            to="/profile"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow group"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h4 className="text-sm font-semibold text-gray-900">View Profile</h4>
            <p className="text-xs text-gray-500 mt-1">See your full profile details</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
