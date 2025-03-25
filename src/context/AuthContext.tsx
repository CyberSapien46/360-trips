
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '../hooks/use-toast';

type User = {
  id: string;
  name: string;
  email: string;
  photoUrl: string | null;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('vr-travel-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // For demo purposes, we're simulating an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would validate against a backend
      // For now, we'll use a mock user
      if (email === 'demo@example.com' && password === 'password') {
        const newUser = {
          id: '1',
          name: 'Demo User',
          email: 'demo@example.com',
          photoUrl: null,
        };
        setUser(newUser);
        localStorage.setItem('vr-travel-user', JSON.stringify(newUser));
        toast({
          title: "Success",
          description: "You've successfully logged in",
        });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
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
      // For demo purposes, we're simulating an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would send this data to your backend
      const newUser = {
        id: Math.random().toString(36).substring(2, 9),
        name,
        email,
        photoUrl: null,
      };
      
      // For demo, we're just storing in localStorage
      localStorage.setItem('vr-travel-user', JSON.stringify(newUser));
      
      toast({
        title: "Account created",
        description: "Your account has been successfully created. Please log in.",
      });
    } catch (error) {
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vr-travel-user');
    toast({
      title: "Logged out",
      description: "You've been successfully logged out",
    });
  };

  const updateProfile = async (data: Partial<User>) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('vr-travel-user', JSON.stringify(updatedUser));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
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
