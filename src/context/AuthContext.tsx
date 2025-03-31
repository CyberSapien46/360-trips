
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';

// Simple admin check 
const ADMIN_EMAILS = ['admin@example.com']; 

type UserProfile = {
  id: string;
  name: string;
  email: string;
  photoUrl: string | null;
  isAdmin: boolean;
};

type AuthContextType = {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Set axios defaults for auth
axios.defaults.baseURL = 'http://localhost:5000/api';
axios.defaults.headers.post['Content-Type'] = 'application/json';

// Add token to requests if available
const setAuthToken = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
    localStorage.setItem('token', token);
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
    localStorage.removeItem('token');
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Load user on initial render if token exists
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        setAuthToken(token);
        try {
          const res = await axios.get('/users/me');
          
          const userData = res.data;
          const isAdmin = ADMIN_EMAILS.includes(userData.email);
          
          setUser({
            id: userData._id,
            name: userData.name,
            email: userData.email,
            photoUrl: userData.photoUrl,
            isAdmin
          });
        } catch (error) {
          console.error('Error loading user:', error);
          setAuthToken(null);
        }
      }
      
      setIsLoading(false);
    };
    
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await axios.post('/users/login', { email, password });
      
      const { token } = res.data;
      setAuthToken(token);
      
      // Fetch user data
      const userRes = await axios.get('/users/me');
      const userData = userRes.data;
      const isAdmin = ADMIN_EMAILS.includes(userData.email);
      
      setUser({
        id: userData._id,
        name: userData.name,
        email: userData.email,
        photoUrl: userData.photoUrl,
        isAdmin
      });
      
      toast({
        title: "Success",
        description: "Login successful",
      });
      
    } catch (error: any) {
      console.error('Login error:', error);
      setAuthToken(null);
      
      toast({
        title: "Login failed",
        description: error.response?.data?.msg || "An unknown error occurred",
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await axios.post('/users/register', { name, email, password });
      
      toast({
        title: "Account created",
        description: "Your account has been successfully created. You can now log in.",
      });
      
    } catch (error: any) {
      console.error('Signup error:', error);
      
      toast({
        title: "Signup failed",
        description: error.response?.data?.msg || "An unknown error occurred",
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    
    toast({
      title: "Logged out",
      description: "You've been successfully logged out",
    });
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    setIsLoading(true);
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const res = await axios.put('/users/profile', {
        name: data.name,
        photoUrl: data.photoUrl
      });
      
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.response?.data?.msg || "An unknown error occurred",
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || false,
        isLoading,
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
