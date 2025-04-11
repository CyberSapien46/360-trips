import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

// Simple admin check - in a real app, you'd have proper roles in your DB
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
  grantAdminAccess: (email: string) => Promise<void>;
  revokeAdminAccess: (email: string) => Promise<void>;
  adminEmails: string[];
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
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [adminEmails, setAdminEmails] = useState<string[]>(ADMIN_EMAILS);

  // Helper function to extract profile data from DB result and session
  const createUserProfile = (userData: any, userSession: Session): UserProfile => {
    // Check if this is our special admin account
    if (userSession.user.email === 'admin@example.com') {
      return {
        id: userSession.user.id,
        name: userData?.name || userSession.user.user_metadata?.name || 'Admin',
        email: userSession.user.email,
        photoUrl: userData?.photo_url || null,
        isAdmin: true, // Always true for admin account
      };
    }
    
    const isAdmin = adminEmails.includes(userSession.user.email || '');
    return {
      id: userSession.user.id,
      name: userData?.name || userSession.user.user_metadata?.name || 'User',
      email: userSession.user.email!,
      photoUrl: userData?.photo_url || null,
      isAdmin: isAdmin,
    };
  };

  // Separate function to fetch user profile
  const fetchUserProfile = async (userId: string, currentSession: Session) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (data && !error) {
        console.log('Profile found:', data);
        const userProfile = createUserProfile(data, currentSession);
        setUser(userProfile);
      } else {
        console.log('Profile not found, creating one');
        // If profile doesn't exist, create one
        const userProfile: UserProfile = {
          id: userId,
          name: currentSession.user.user_metadata?.name || 'User',
          email: currentSession.user.email!,
          photoUrl: null,
          isAdmin: ADMIN_EMAILS.includes(currentSession.user.email || ''),
        };
        setUser(userProfile);
        
        // Create the profile in the database
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            name: currentSession.user.user_metadata?.name || 'User',
            email: currentSession.user.email!,
            photo_url: null,
            created_at: new Date().toISOString(),
          });
          
        if (insertError) {
          console.error('Error creating profile:', insertError);
        } else {
          console.log('New profile created successfully');
        }
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  };

  useEffect(() => {
    // First, get the current session
    const initAuth = async () => {
      console.log('Initializing auth');
      
      const { data } = await supabase.auth.getSession();
      const { session: currentSession } = data;
      
      console.log('Current session on init:', currentSession);
      setSession(currentSession);
      
      if (currentSession) {
        // Set isLoading to true before fetching profile
        setIsLoading(true);
        
        // Use setTimeout to avoid any potential deadlocks
        setTimeout(() => {
          fetchUserProfile(currentSession.user.id, currentSession)
            .finally(() => setIsLoading(false));
        }, 0);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    };
    
    initAuth();
    
    // Then, set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession);
        setSession(currentSession);
        
        if (currentSession) {
          // Set isLoading to true before fetching profile
          setIsLoading(true);
          
          // Use setTimeout to avoid any potential deadlocks
          setTimeout(() => {
            fetchUserProfile(currentSession.user.id, currentSession)
              .finally(() => setIsLoading(false));
          }, 0);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('Attempting login for:', email);
      
      // Special handling for admin account
      if (email === 'admin@example.com' && password === 'admin123') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: 'admin123', // Use the admin password
        });
        
        if (error) {
          console.error('Admin login error:', error);
          throw new Error(error.message);
        }
        
        console.log('Admin login successful:', data);
        
        toast({
          title: "Success",
          description: "Admin login successful",
        });
        
        return;
      }
      
      // Regular user login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Login error:', error);
        throw new Error(error.message);
      }
      
      console.log('Login successful:', data);
      
      toast({
        title: "Success",
        description: "Login successful",
      });
      
      // The auth state change handler will update the user
      
    } catch (error) {
      console.error('Login error caught:', error);
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
      console.log('Starting signup process for:', email);
      
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
        console.error('Signup error:', error);
        throw new Error(error.message);
      }
      
      console.log('Signup response:', data);
      
      if (data && data.user) {
        // Create profile in profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name,
            email,
            photo_url: null,
            created_at: new Date().toISOString(),
          });
          
        if (profileError) {
          console.error('Error creating profile:', profileError);
        }
      }
      
      toast({
        title: "Account created",
        description: "Your account has been successfully created. Please check your email to confirm your account before logging in.",
      });
      
    } catch (error) {
      console.error('Full signup error:', error);
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
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
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

  const updateProfile = async (data: Partial<UserProfile>) => {
    setIsLoading(true);
    try {
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

  const grantAdminAccess = async (email: string) => {
    try {
      if (!user?.isAdmin) {
        throw new Error('Only admins can grant admin privileges');
      }
      
      if (adminEmails.includes(email)) {
        toast({
          description: "This user already has admin access",
        });
        return;
      }
      
      // In a real app, you might store this in a database table
      // Here we're just updating the state
      const updatedAdminEmails = [...adminEmails, email];
      setAdminEmails(updatedAdminEmails);
      
      toast({
        title: "Admin access granted",
        description: `Admin privileges have been granted to ${email}`,
      });
    } catch (error) {
      console.error('Error granting admin access:', error);
      toast({
        title: "Failed to grant admin access",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  const revokeAdminAccess = async (email: string) => {
    try {
      if (!user?.isAdmin) {
        throw new Error('Only admins can revoke admin privileges');
      }
      
      if (email === user.email) {
        throw new Error('You cannot revoke your own admin privileges');
      }
      
      if (!adminEmails.includes(email)) {
        toast({
          description: "This user doesn't have admin access",
        });
        return;
      }
      
      // In a real app, you might update this in a database table
      const updatedAdminEmails = adminEmails.filter(e => e !== email);
      setAdminEmails(updatedAdminEmails);
      
      toast({
        title: "Admin access revoked",
        description: `Admin privileges have been revoked from ${email}`,
      });
    } catch (error) {
      console.error('Error revoking admin access:', error);
      toast({
        title: "Failed to revoke admin access",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw error;
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
        grantAdminAccess,
        revokeAdminAccess,
        adminEmails,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
