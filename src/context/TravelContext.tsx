
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type Destination = {
  id: string;
  name: string;
  location: string;
  description: string;
  imageUrl: string;
  videoUrl: string;
  price: number;
  rating: number;
};

export type VRBooking = {
  id: string;
  userId: string;
  date: string;
  time: string;
  address: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  additionalNotes?: string;
};

export type QuoteRequest = {
  id: string;
  userId: string;
  packageIds: string[];
  status: 'pending' | 'contacted' | 'completed' | 'cancelled';
  createdAt: string;
};

type TravelContextType = {
  userPackages: string[];
  bookings: VRBooking[];
  addToPackage: (destinationId: string) => void;
  removeFromPackage: (destinationId: string) => void;
  createVRBooking: (booking: Omit<VRBooking, 'id' | 'createdAt'>) => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;
  isInPackage: (destinationId: string) => boolean;
  requestQuote: () => Promise<void>;
};

const TravelContext = createContext<TravelContextType | undefined>(undefined);

export const useTravel = () => {
  const context = useContext(TravelContext);
  if (context === undefined) {
    throw new Error('useTravel must be used within a TravelProvider');
  }
  return context;
};

export const TravelProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { user, isAuthenticated } = useAuth();
  const [userPackages, setUserPackages] = useState<string[]>([]);
  const [bookings, setBookings] = useState<VRBooking[]>([]);

  // Load packages and bookings from Supabase when auth state changes
  useEffect(() => {
    const loadUserData = async () => {
      if (isAuthenticated && user) {
        try {
          // Try to load from Supabase first
          const { data: packageData, error: packageError } = await supabase
            .from('user_packages')
            .select('destination_id')
            .eq('user_id', user.id);
          
          if (packageError) throw packageError;
          
          if (packageData && packageData.length > 0) {
            const packages = packageData.map(item => item.destination_id);
            setUserPackages(packages);
          } else {
            // If no data in Supabase, check localStorage as fallback
            const storedPackages = localStorage.getItem(`vr-travel-packages-${user.id}`);
            if (storedPackages) {
              setUserPackages(JSON.parse(storedPackages));
              
              // Migrate localStorage data to Supabase
              const packagesToInsert = JSON.parse(storedPackages).map((destId: string) => ({
                user_id: user.id,
                destination_id: destId
              }));
              
              if (packagesToInsert.length > 0) {
                await supabase.from('user_packages').insert(packagesToInsert);
              }
            }
          }
          
          // Load bookings
          const { data: bookingData, error: bookingError } = await supabase
            .from('vr_bookings')
            .select('*')
            .eq('user_id', user.id);
          
          if (bookingError) throw bookingError;
          
          if (bookingData) {
            // Convert from snake_case to camelCase
            const formattedBookings: VRBooking[] = bookingData.map(booking => ({
              id: booking.id,
              userId: booking.user_id,
              date: booking.date,
              time: booking.time,
              address: booking.address,
              status: booking.status as 'pending' | 'confirmed' | 'completed' | 'cancelled',
              createdAt: booking.created_at,
              additionalNotes: booking.additional_notes || undefined
            }));
            setBookings(formattedBookings);
          } else {
            // If no data in Supabase, check localStorage as fallback
            const storedBookings = localStorage.getItem(`vr-travel-bookings-${user.id}`);
            if (storedBookings) {
              setBookings(JSON.parse(storedBookings));
              
              // Migrate localStorage bookings to Supabase
              const parsedBookings = JSON.parse(storedBookings);
              if (parsedBookings.length > 0) {
                const bookingsToInsert = parsedBookings.map((booking: VRBooking) => ({
                  id: booking.id,
                  user_id: booking.userId,
                  date: booking.date,
                  time: booking.time,
                  address: booking.address,
                  status: booking.status,
                  created_at: booking.createdAt,
                  additional_notes: booking.additionalNotes || null
                }));
                
                await supabase.from('vr_bookings').insert(bookingsToInsert);
              }
            }
          }
        } catch (error) {
          console.error('Error loading user data:', error);
          toast({
            description: "Failed to load your travel data",
            variant: "destructive"
          });
          
          // Fallback to localStorage if Supabase fails
          const storedPackages = localStorage.getItem(`vr-travel-packages-${user.id}`);
          const storedBookings = localStorage.getItem(`vr-travel-bookings-${user.id}`);
          
          if (storedPackages) {
            setUserPackages(JSON.parse(storedPackages));
          }
          
          if (storedBookings) {
            setBookings(JSON.parse(storedBookings));
          }
        }
      } else {
        // Not authenticated, use anonymous storage
        const storedPackages = localStorage.getItem('vr-travel-packages');
        const storedBookings = localStorage.getItem('vr-travel-bookings');
        
        if (storedPackages) {
          setUserPackages(JSON.parse(storedPackages));
        }
        
        if (storedBookings) {
          setBookings(JSON.parse(storedBookings));
        }
      }
    };
    
    loadUserData();
  }, [isAuthenticated, user]);

  // Save to localStorage as fallback when state changes
  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem(`vr-travel-packages-${user.id}`, JSON.stringify(userPackages));
    } else {
      localStorage.setItem('vr-travel-packages', JSON.stringify(userPackages));
    }
  }, [userPackages, isAuthenticated, user]);

  // Save bookings to localStorage as fallback
  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem(`vr-travel-bookings-${user.id}`, JSON.stringify(bookings));
    } else {
      localStorage.setItem('vr-travel-bookings', JSON.stringify(bookings));
    }
  }, [bookings, isAuthenticated, user]);

  const addToPackage = async (destinationId: string) => {
    if (!userPackages.includes(destinationId)) {
      try {
        // Update local state first for immediate UI feedback
        setUserPackages(prev => [...prev, destinationId]);
        
        // If authenticated, store in Supabase
        if (isAuthenticated && user) {
          const { error } = await supabase
            .from('user_packages')
            .insert({ 
              user_id: user.id,
              destination_id: destinationId 
            });
          
          if (error) throw error;
        }
        
        toast({
          title: "Added to package",
          description: "Destination has been added to your travel package",
        });
      } catch (error) {
        console.error('Error adding to package:', error);
        toast({
          description: "Failed to add destination to your package",
          variant: "destructive"
        });
      }
    } else {
      toast({
        description: "This destination is already in your package",
      });
    }
  };

  const removeFromPackage = async (destinationId: string) => {
    try {
      // Update local state first for immediate UI feedback
      setUserPackages(prev => prev.filter(id => id !== destinationId));
      
      // If authenticated, remove from Supabase
      if (isAuthenticated && user) {
        const { error } = await supabase
          .from('user_packages')
          .delete()
          .eq('user_id', user.id)
          .eq('destination_id', destinationId);
        
        if (error) throw error;
      }
      
      toast({
        description: "Destination has been removed from your package",
      });
    } catch (error) {
      console.error('Error removing from package:', error);
      toast({
        description: "Failed to remove destination from your package",
        variant: "destructive"
      });
    }
  };

  const isInPackage = (destinationId: string) => {
    return userPackages.includes(destinationId);
  };

  const createVRBooking = async (booking: Omit<VRBooking, 'id' | 'createdAt'>) => {
    try {
      const id = Math.random().toString(36).substring(2, 9);
      const createdAt = new Date().toISOString();
      
      const newBooking: VRBooking = {
        ...booking,
        id,
        createdAt,
      };
      
      // Update local state first for immediate UI feedback
      setBookings(prev => [...prev, newBooking]);
      
      // If authenticated, store in Supabase
      if (isAuthenticated && user) {
        const { error } = await supabase
          .from('vr_bookings')
          .insert({ 
            id,
            user_id: booking.userId,
            date: booking.date,
            time: booking.time,
            address: booking.address,
            status: booking.status,
            created_at: createdAt,
            additional_notes: booking.additionalNotes || null
          });
        
        if (error) throw error;
      }
      
      toast({
        title: "Booking confirmed",
        description: "Your VR experience has been booked successfully",
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Booking failed",
        description: "There was an error creating your booking",
        variant: "destructive"
      });
      throw error;
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      // Update local state first for immediate UI feedback
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'cancelled' } 
            : booking
        )
      );
      
      // If authenticated, update in Supabase
      if (isAuthenticated && user) {
        const { error } = await supabase
          .from('vr_bookings')
          .update({ status: 'cancelled' })
          .eq('id', bookingId)
          .eq('user_id', user.id);
        
        if (error) throw error;
      }
      
      toast({
        description: "Your booking has been cancelled",
      });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({
        description: "Failed to cancel your booking",
        variant: "destructive"
      });
      throw error;
    }
  };

  const requestQuote = async () => {
    if (!isAuthenticated || !user || userPackages.length === 0) {
      toast({
        description: "You need to add destinations to your package first",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const quoteRequest = {
        id: Math.random().toString(36).substring(2, 9),
        user_id: user.id,
        package_ids: userPackages,
        status: 'pending',
        created_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('quote_requests')
        .insert(quoteRequest);
      
      if (error) throw error;
      
      toast({
        title: "Quote request submitted",
        description: "We'll contact you soon with a custom quote",
      });
    } catch (error) {
      console.error('Error requesting quote:', error);
      toast({
        title: "Request failed",
        description: "There was an error submitting your quote request",
        variant: "destructive"
      });
      throw error;
    }
  };

  return (
    <TravelContext.Provider
      value={{
        userPackages,
        bookings,
        addToPackage,
        removeFromPackage,
        createVRBooking,
        cancelBooking,
        isInPackage,
        requestQuote,
      }}
    >
      {children}
    </TravelContext.Provider>
  );
};
