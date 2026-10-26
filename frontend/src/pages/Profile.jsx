import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  const getInitials = (username) => {
    if (!username) return '?';
    return username.charAt(0).toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header Banner */}
          <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600"></div>

          {/* Avatar */}
          <div className="flex justify-center -mt-16">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-indigo-600 flex items-center justify-center border-4 border-white shadow-lg">
                <span className="text-white text-4xl font-bold">{getInitials(user?.username)}</span>
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="text-center mt-4 pb-8 px-6">
            <h1 className="text-2xl font-bold text-gray-900">{user?.username}</h1>
            <p className="text-gray-600 mt-1">{user?.email}</p>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-3 ${
                user?.isVerified
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {user?.isVerified ? '✓ Verified' : '⚠ Unverified'}
            </span>

            {/* Details */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Username</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">{user?.username}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">{user?.email}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {user?.isVerified ? 'Verified' : 'Unverified'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Member Since</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {formatDate(user?.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                to="/profile/edit"
                className="inline-flex items-center justify-center px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Profile
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center px-6 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
