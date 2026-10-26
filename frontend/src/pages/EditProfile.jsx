import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateProfile, uploadAvatar } from '../services/user.api';
import { validateUsername, validateEmail } from '../utils/validation';
import toast from 'react-hot-toast';

const EditProfile = () => {
  const { user, setUser } = useAuth();

  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const getInitials = (username) => {
    if (!username) return '?';
    return username.charAt(0).toUpperCase();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) {
      toast.error('Please select an image first');
      return;
    }
    setIsUploadingAvatar(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append('avatar', avatarFile);
      const response = await uploadAvatar(formDataObj);
      const updatedUser = response.data?.data?.user || response.data?.user;
      setUser(updatedUser);
      setAvatarFile(null);
      toast.success('Avatar updated successfully!');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to upload avatar.';
      toast.error(message);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const usernameError = validateUsername(formData.username);
    const emailError = validateEmail(formData.email);
    if (usernameError) newErrors.username = usernameError;
    if (emailError) newErrors.email = emailError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await updateProfile(formData);
      const updatedUser = response.data?.data?.user || response.data?.user;
      setUser(updatedUser);
      toast.success('Profile updated successfully!');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
          <p className="mt-1 text-gray-600">Update your personal information</p>
        </div>

        {/* Avatar Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h2>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="w-24 h-24 rounded-full object-cover border-2 border-indigo-200"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">{getInitials(user?.username)}</span>
                </div>
              )}
            </div>
            <div className="flex-1 w-full">
              <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-2">
                Choose a new photo
              </label>
              <input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 cursor-pointer"
              />
              <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
              {avatarFile && (
                <button
                  type="button"
                  onClick={handleAvatarUpload}
                  disabled={isUploadingAvatar}
                  className="mt-3 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isUploadingAvatar ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Uploading...
                    </span>
                  ) : (
                    'Upload Avatar'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-invalid={!!errors.username}
                aria-describedby={errors.username ? 'edit-username-error' : undefined}
              />
              {errors.username && (
                <p id="edit-username-error" className="mt-1 text-sm text-red-500">{errors.username}</p>
              )}
            </div>

            <div>
              <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="edit-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'edit-email-error' : undefined}
              />
              {errors.email && (
                <p id="edit-email-error" className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
              <p className="mt-1 text-xs text-amber-600">
                Note: Changing your email will require re-verification.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
              <Link
                to="/dashboard"
                className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
