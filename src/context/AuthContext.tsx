
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

type UserProfile = {
  id: string;
  name: string;
  email: string;
  photoUrl: string | null;
};

type AuthContextType = {
  user: UserProfile | null;
  isAuthenticated: boolean;
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // First, set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession);
        setSession(currentSession);
        
        if (currentSession) {
          try {
            // Get user profile data from Supabase
            const { data, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', currentSession.user.id)
              .single();
            
            if (data && !error) {
              const userData: UserProfile = {
                id: currentSession.user.id,
                name: data.name || currentSession.user.user_metadata?.name || 'User',
                email: currentSession.user.email!,
                photoUrl: data.photo_url || null,
              };
              setUser(userData);
            } else {
              // If profile doesn't exist yet, create basic user object
              const userData: UserProfile = {
                id: currentSession.user.id,
                name: currentSession.user.user_metadata?.name || 'User',
                email: currentSession.user.email!,
                photoUrl: null,
              };
              setUser(userData);
              
              // Try to create the profile if it doesn't exist
              if (error && error.code === 'PGRST116') {
                // Create profile in profiles table if not exists
                const { error: insertError } = await supabase
                  .from('profiles')
                  .insert([
                    {
                      id: currentSession.user.id,
                      name: currentSession.user.user_metadata?.name || 'User',
                      email: currentSession.user.email!,
                      photo_url: null,
                      created_at: new Date().toISOString(),
                    },
                  ]);
                  
                if (insertError) {
                  console.error('Error creating profile:', insertError);
                }
              }
            }
          } catch (err) {
            console.error('Error fetching user profile:', err);
          }
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );
    
    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('Current session:', currentSession);
      setSession(currentSession);
      
      if (currentSession) {
        // Get user profile from session
        supabase
          .from('profiles')
          .select('*')
          .eq('id', currentSession.user.id)
          .single()
          .then(({ data, error }) => {
            if (data && !error) {
              const userData: UserProfile = {
                id: currentSession.user.id,
                name: data.name || currentSession.user.user_metadata?.name || 'User',
                email: currentSession.user.email!,
                photoUrl: data.photo_url || null,
              };
              setUser(userData);
            } else {
              // If profile doesn't exist yet, create basic user object
              const userData: UserProfile = {
                id: currentSession.user.id,
                name: currentSession.user.user_metadata?.name || 'User',
                email: currentSession.user.email!,
                photoUrl: null,
              };
              setUser(userData);
            }
            setIsLoading(false);
          });
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data && data.user) {
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
              created_at: new Date().toISOString(),
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
