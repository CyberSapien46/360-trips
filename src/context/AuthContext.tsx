
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Define types
type User = {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  isAdmin?: boolean;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isAdmin, setIsAdmin] = useState(false);

  // Configure axios
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
    }
  }, [token]);

  // Load user on first render or when token changes
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await axios.get('/api/users/me');
        setUser({
          id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          photoUrl: res.data.photoUrl,
          isAdmin: res.data.isAdmin
        });
        setIsAuthenticated(true);
        setIsAdmin(!!res.data.isAdmin);
      } catch (err) {
        console.error('Error loading user:', err);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Register user
  const signup = async (name: string, email: string, password: string) => {
    try {
      const res = await axios.post('/api/users', { name, email, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      
      // The loadUser effect will trigger after setToken
      return Promise.resolve();
    } catch (err: any) {
      console.error('Registration error:', err.response?.data?.msg || err.message);
      return Promise.reject(err.response?.data?.msg || 'Registration failed');
    }
  };

  // Login user
  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post('/api/users/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      
      // The loadUser effect will trigger after setToken
      return Promise.resolve();
    } catch (err: any) {
      console.error('Login error:', err.response?.data?.msg || err.message);
      return Promise.reject(err.response?.data?.msg || 'Login failed');
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  // Update user profile
  const updateProfile = async (data: Partial<User>) => {
    try {
      const res = await axios.put('/api/users/me', data);
      setUser(prev => prev ? { ...prev, ...data } : null);
      return Promise.resolve();
    } catch (err: any) {
      console.error('Update profile error:', err.response?.data?.msg || err.message);
      return Promise.reject(err.response?.data?.msg || 'Update failed');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        isAdmin,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
