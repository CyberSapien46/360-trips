
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with fallback values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create client with conditional check
const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Show error message if Supabase credentials are missing
if (!supabase) {
  console.error('Supabase URL and/or Anon Key are missing.');
}

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if Supabase client is available
    if (!supabase) {
      setIsLoading(false);
      toast({
        title: "Configuration Error",
        description: "Supabase is not properly configured. Please check your environment variables.",
        variant: "destructive",
      });
      return;
    }

    // Check if user is authenticated with Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setIsLoading(true);
        
        if (session) {
          // Get user profile data from Supabase
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (data && !error) {
            const userData: User = {
              id: session.user.id,
              name: data.name || session.user.user_metadata?.name || 'User',
              email: session.user.email!,
              photoUrl: data.photo_url || null,
            };
            setUser(userData);
            localStorage.setItem('vr-travel-user', JSON.stringify(userData));
          } else {
            // If profile doesn't exist yet, create basic user object
            const userData: User = {
              id: session.user.id,
              name: session.user.user_metadata?.name || 'User',
              email: session.user.email!,
              photoUrl: null,
            };
            setUser(userData);
            localStorage.setItem('vr-travel-user', JSON.stringify(userData));
          }
        } else {
          setUser(null);
          localStorage.removeItem('vr-travel-user');
        }
        
        setIsLoading(false);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (!supabase) {
        throw new Error('Supabase is not properly configured');
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data && data.user) {
        // User profile will be set by the auth state change listener
        toast({
          title: "Success",
          description: "You've successfully logged in",
        });
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
      if (!supabase) {
        throw new Error('Supabase is not properly configured');
      }
      
      // Create auth user in Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data && data.user) {
        // Create profile in profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              name,
              email,
              photo_url: null,
              created_at: new Date(),
            },
          ]);
          
        if (profileError) {
          console.error('Error creating profile:', profileError);
        }
      }
      
      toast({
        title: "Account created",
        description: "Your account has been successfully created. Please log in.",
      });
      
      // Sign out after registration so user can log in explicitly
      await supabase.auth.signOut();
      
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

  const logout = async () => {
    try {
      if (!supabase) {
        throw new Error('Supabase is not properly configured');
      }
      
      await supabase.auth.signOut();
      setUser(null);
      localStorage.removeItem('vr-travel-user');
      toast({
        title: "Logged out",
        description: "You've been successfully logged out",
      });
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Logout failed",
        description: "There was an error logging out",
        variant: "destructive",
      });
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    setIsLoading(true);
    try {
      if (!supabase) {
        throw new Error('Supabase is not properly configured');
      }
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          photo_url: data.photoUrl,
          // Don't update email through this method, use Supabase auth for that
        })
        .eq('id', user.id);
        
      if (error) {
        throw new Error(error.message);
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
