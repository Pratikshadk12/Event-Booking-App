import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(Cookies.get('token') || null);

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('eventHiveUser');
    if (savedUser && !user) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('eventHiveUser');
      }
    }
  }, []);

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Add axios interceptor for handling token expiration
  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && token && !token.startsWith('mock_token_')) {
          // Token expired or invalid
          console.log('Token expired, logging out...');
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [token]);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          // Check if it's a mock token (demo mode)
          if (token.startsWith('mock_token_')) {
            // For demo mode, create a mock user from the token
            const mockUser = {
              id: Date.now(),
              name: 'Demo User',
              email: 'demo@example.com',
              role: 'user',
              onboardingCompleted: true // For demo purposes
            };
            setUser(mockUser);
          } else {
            // Real token - verify with backend
            const response = await axios.get(`${API_BASE_URL}/auth/me`);
            setUser(response.data.data.user);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          // Only logout if it's not a network error (backend unavailable)
          if (error.code !== 'ERR_NETWORK' && !error.message.includes('Network Error') && !error.message.includes('ECONNREFUSED')) {
            logout();
          } else {
            // Backend is unavailable, but keep user logged in if they have a token
            console.log('Backend unavailable, maintaining session...');
            // Create a fallback user for network errors
            if (!user) {
              const fallbackUser = {
                id: Date.now(),
                name: 'User',
                email: 'user@example.com',
                role: 'user',
                onboardingCompleted: true
              };
              setUser(fallbackUser);
            }
          }
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });

      const { user: userData, token: authToken } = response.data.data;
      
      setUser(userData);
      setToken(authToken);
      Cookies.set('token', authToken, { expires: 7 });
      localStorage.setItem('eventHiveUser', JSON.stringify(userData));
      
      toast.success(`Welcome back, ${userData.name}! 🎉`);
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle network errors (backend not running)
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error') || error.message.includes('ECONNREFUSED')) {
        // Check if user exists in localStorage for demo mode
        const savedUser = localStorage.getItem('eventHiveUser');
        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            // Verify email matches for security
            if (parsedUser.email === email) {
              const mockToken = 'mock_token_' + Date.now();
              
              setUser(parsedUser);
              setToken(mockToken);
              Cookies.set('token', mockToken, { expires: 7 });
              
              toast.success(`Welcome back, ${parsedUser.name}! 🎉 (Demo Mode)`);
              return { success: true, user: parsedUser };
            }
          } catch (parseError) {
            console.error('Error parsing saved user:', parseError);
          }
        }
        
        // For development: Create a mock user when backend is not available
        const mockUser = {
          id: Date.now(),
          name: email.split('@')[0], // Use part of email as name
          email,
          role: 'user',
          onboardingCompleted: true // For demo purposes
        };
        
        const mockToken = 'mock_token_' + Date.now();
        
        setUser(mockUser);
        setToken(mockToken);
        Cookies.set('token', mockToken, { expires: 7 });
        localStorage.setItem('eventHiveUser', JSON.stringify(mockUser));
        
        toast.success(`Welcome, ${mockUser.name}! 🎉 (Demo Mode)`);
        return { success: true, user: mockUser };
      }
      
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        name,
        email,
        password
      });

      const { user: userData, token: authToken } = response.data.data;
      
      setUser(userData);
      setToken(authToken);
      Cookies.set('token', authToken, { expires: 7 });
      localStorage.setItem('eventHiveUser', JSON.stringify(userData));
      
      toast.success(`Welcome to EventHive, ${userData.name}! 🎊`);
      return { success: true, user: userData };
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle network errors (backend not running)
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error') || error.message.includes('ECONNREFUSED')) {
        // For development: Create a mock user when backend is not available
        const mockUser = {
          id: Date.now(),
          name,
          email,
          role: 'user',
          onboardingCompleted: false
        };
        
        const mockToken = 'mock_token_' + Date.now();
        
        setUser(mockUser);
        setToken(mockToken);
        Cookies.set('token', mockToken, { expires: 7 });
        localStorage.setItem('eventHiveUser', JSON.stringify(mockUser));
        
        toast.success(`Welcome to EventHive, ${name}! 🎊 (Demo Mode)`);
        return { success: true, user: mockUser };
      }
      
      // Handle specific backend errors
      if (error.response?.status === 400) {
        const message = error.response.data?.message || 'Invalid registration data';
        toast.error(message);
        return { success: false, message };
      }
      
      if (error.response?.status === 409) {
        const message = 'Email already exists. Please use a different email or try logging in.';
        toast.error(message);
        return { success: false, message };
      }
      
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    Cookies.remove('token');
    localStorage.removeItem('eventHiveUser');
    delete axios.defaults.headers.common['Authorization'];
    toast.info('Logged out successfully');
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/auth/profile`, profileData);
      setUser(response.data.data.user);
      toast.success('Profile updated successfully! ✨');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const completeOnboarding = async (onboardingData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/onboarding`, onboardingData);
      setUser(response.data.data.user);
      toast.success('Onboarding completed! Let\'s explore events! 🚀');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Onboarding failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    completeOnboarding,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};