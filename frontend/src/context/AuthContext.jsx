import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { setStoredAccessToken, getStoredAccessToken } from '../services/api';
import { refreshToken, logoutUser } from '../services/auth.api';
import { getProfile } from '../services/user.api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [accessToken, setAccessTokenState] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync token with axios module memory
  const updateAccessToken = useCallback((token) => {
    setAccessTokenState(token);
    setStoredAccessToken(token);
  }, []);

  const setUser = useCallback((newUser) => {
    setUserState(newUser);
  }, []);

  const setCredentials = useCallback(({ user: newUser, accessToken: newToken }) => {
    if (newUser !== undefined) setUserState(newUser);
    if (newToken !== undefined) {
      setAccessTokenState(newToken);
      setStoredAccessToken(newToken);
    }
    setLoading(false);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (error) {
      // Ignore API errors on logout
    }
    setUserState(null);
    updateAccessToken(null);
    setLoading(false);
  }, [updateAccessToken]);

  // Persistent login on initial mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const refreshRes = await refreshToken();
        const newToken = refreshRes.data?.data?.accessToken || refreshRes.data?.accessToken;

        if (newToken) {
          updateAccessToken(newToken);
          const profileRes = await getProfile();
          const profileUser = profileRes.data?.data?.user || profileRes.data?.user;
          setUserState(profileUser);
        } else {
          setUserState(null);
          updateAccessToken(null);
        }
      } catch (err) {
        setUserState(null);
        updateAccessToken(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen to token refresh or logout events triggered by Axios interceptor
    const handleAuthTokenRefreshed = (e) => {
      const newToken = e.detail;
      setAccessTokenState(newToken);
    };

    const handleAuthLogout = () => {
      setUserState(null);
      setAccessTokenState(null);
      setLoading(false);
    };

    window.addEventListener('auth:token-refreshed', handleAuthTokenRefreshed);
    window.addEventListener('auth:logout', handleAuthLogout);

    return () => {
      window.removeEventListener('auth:token-refreshed', handleAuthTokenRefreshed);
      window.removeEventListener('auth:logout', handleAuthLogout);
    };
  }, [updateAccessToken]);

  const value = {
    user,
    accessToken,
    isAuthenticated: !!user && !!accessToken,
    loading,
    setUser,
    setCredentials,
    logout,
    setLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
