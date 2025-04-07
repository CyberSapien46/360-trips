import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface Destination {
  id: string;
  name: string;
  location: string;
  description: string;
  imageUrl: string;
  videoUrl: string;
  price: number;
  rating: number;
}

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

export type PackageGroup = {
  id: string;
  name: string;
  createdAt: string;
};

type TravelContextType = {
  userPackages: string[];
  bookings: VRBooking[];
  packageGroups: PackageGroup[];
  currentPackageGroup: PackageGroup | null;
  addToPackage: (destinationId: string, packageName?: string) => void;
  removeFromPackage: (destinationId: string) => void;
  createVRBooking: (booking: Omit<VRBooking, 'id' | 'createdAt'>) => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;
  isInPackage: (destinationId: string) => boolean;
  requestQuote: () => Promise<void>;
  createPackageGroup: (name: string) => Promise<void>;
  setCurrentPackageGroup: (packageGroup: PackageGroup | null) => void;
  hasActiveBooking: boolean;
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
  const [packageGroups, setPackageGroups] = useState<PackageGroup[]>([]);
  const [currentPackageGroup, setCurrentPackageGroup] = useState<PackageGroup | null>(null);
  const [hasActiveBooking, setHasActiveBooking] = useState(false);

  useEffect(() => {
    if (bookings.length > 0) {
      const activeBooking = bookings.some(booking => 
        booking.status !== 'cancelled' && booking.status !== 'completed'
      );
      setHasActiveBooking(activeBooking);
    } else {
      setHasActiveBooking(false);
    }
  }, [bookings]);

  useEffect(() => {
    const loadUserData = async () => {
      if (isAuthenticated && user) {
        try {
          const { data: groupsData, error: groupsError } = await supabase
            .from('package_groups')
            .select('*')
            .eq('user_id', user.id);
          
          if (groupsError) throw groupsError;
          
          if (groupsData && groupsData.length > 0) {
            const formattedGroups: PackageGroup[] = groupsData.map(group => ({
              id: group.id,
              name: group.name,
              createdAt: group.created_at
            }));
            setPackageGroups(formattedGroups);
            
            if (!currentPackageGroup) {
              setCurrentPackageGroup(formattedGroups[0]);
            }
          } else {
            if (isAuthenticated && user) {
              const defaultGroupName = "My Travel Packages";
              const { data: newGroup, error: createError } = await supabase
                .from('package_groups')
                .insert({ user_id: user.id, name: defaultGroupName })
                .select()
                .single();
              
              if (createError) throw createError;
              
              if (newGroup) {
                const formattedGroup: PackageGroup = {
                  id: newGroup.id,
                  name: newGroup.name,
                  createdAt: newGroup.created_at
                };
                setPackageGroups([formattedGroup]);
                setCurrentPackageGroup(formattedGroup);
              }
            }
          }
          
          const { data: packageData, error: packageError } = await supabase
            .from('user_packages')
            .select('destination_id')
            .eq('user_id', user.id);
          
          if (packageError) throw packageError;
          
          if (packageData && packageData.length > 0) {
            const packages = packageData.map(item => item.destination_id);
            setUserPackages(packages);
          } else {
            const storedPackages = localStorage.getItem(`vr-travel-packages-${user.id}`);
            if (storedPackages) {
              setUserPackages(JSON.parse(storedPackages));
              
              const packagesToInsert = JSON.parse(storedPackages).map((destId: string) => ({
                user_id: user.id,
                destination_id: destId,
                package_name: "My Travel Package"
              }));
              
              if (packagesToInsert.length > 0) {
                await supabase.from('user_packages').insert(packagesToInsert);
              }
            }
          }
          
          const { data: bookingData, error: bookingError } = await supabase
            .from('vr_bookings')
            .select('*')
            .eq('user_id', user.id);
          
          if (bookingError) throw bookingError;
          
          if (bookingData) {
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
            
            const activeBooking = formattedBookings.some(booking => 
              booking.status !== 'cancelled' && booking.status !== 'completed'
            );
            setHasActiveBooking(activeBooking);
          } else {
            const storedBookings = localStorage.getItem(`vr-travel-bookings-${user.id}`);
            if (storedBookings) {
              const parsedBookings = JSON.parse(storedBookings);
              setBookings(parsedBookings);
              
              const activeBooking = parsedBookings.some((booking: VRBooking) => 
                booking.status !== 'cancelled' && booking.status !== 'completed'
              );
              setHasActiveBooking(activeBooking);
              
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
        } catch (error) {
          console.error('Error loading user data:', error);
          toast({
            description: "Failed to load your travel data",
            variant: "destructive"
          });
          
          const storedPackages = localStorage.getItem(`vr-travel-packages-${user.id}`);
          const storedBookings = localStorage.getItem(`vr-travel-bookings-${user.id}`);
          
          if (storedPackages) {
            setUserPackages(JSON.parse(storedPackages));
          }
          
          if (storedBookings) {
            const parsedBookings = JSON.parse(storedBookings);
            setBookings(parsedBookings);
            
            const activeBooking = parsedBookings.some((booking: VRBooking) => 
              booking.status !== 'cancelled' && booking.status !== 'completed'
            );
            setHasActiveBooking(activeBooking);
          }
        }
      } else {
        const storedPackages = localStorage.getItem('vr-travel-packages');
        const storedBookings = localStorage.getItem('vr-travel-bookings');
        
        if (storedPackages) {
          setUserPackages(JSON.parse(storedPackages));
        }
        
        if (storedBookings) {
          const parsedBookings = JSON.parse(storedBookings);
          setBookings(parsedBookings);
          
          const activeBooking = parsedBookings.some((booking: VRBooking) => 
            booking.status !== 'cancelled' && booking.status !== 'completed'
          );
          setHasActiveBooking(activeBooking);
        }
      }
    };
    
    loadUserData();
  }, [isAuthenticated, user, currentPackageGroup]);

  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem(`vr-travel-packages-${user.id}`, JSON.stringify(userPackages));
    } else {
      localStorage.setItem('vr-travel-packages', JSON.stringify(userPackages));
    }
  }, [userPackages, isAuthenticated, user]);

  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem(`vr-travel-bookings-${user.id}`, JSON.stringify(bookings));
    } else {
      localStorage.setItem('vr-travel-bookings', JSON.stringify(bookings));
    }
  }, [bookings, isAuthenticated, user]);

  const createPackageGroup = async (name: string) => {
    if (!isAuthenticated || !user) {
      toast({
        description: "You need to be logged in to create a package group",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('package_groups')
        .insert({ user_id: user.id, name })
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        const newGroup: PackageGroup = {
          id: data.id,
          name: data.name,
          createdAt: data.created_at
        };
        
        setPackageGroups(prev => [...prev, newGroup]);
        setCurrentPackageGroup(newGroup);
        
        toast({
          title: "Package group created",
          description: `Your new group "${name}" has been created`,
        });
      }
    } catch (error) {
      console.error('Error creating package group:', error);
      toast({
        description: "Failed to create package group",
        variant: "destructive"
      });
    }
  };

  const addToPackage = async (destinationId: string, packageName?: string) => {
    if (!userPackages.includes(destinationId)) {
      try {
        if (!currentPackageGroup && isAuthenticated && user) {
          const defaultGroupName = "My Travel Packages";
          const { data: newGroup, error: createError } = await supabase
            .from('package_groups')
            .insert({ user_id: user.id, name: defaultGroupName })
            .select()
            .single();
          
          if (createError) throw createError;
          
          if (newGroup) {
            const formattedGroup: PackageGroup = {
              id: newGroup.id,
              name: newGroup.name,
              createdAt: newGroup.created_at
            };
            setPackageGroups([formattedGroup]);
            setCurrentPackageGroup(formattedGroup);
          }
        }
        
        setUserPackages(prev => [...prev, destinationId]);
        
        if (isAuthenticated && user && currentPackageGroup) {
          const { error } = await supabase
            .from('user_packages')
            .insert({ 
              user_id: user.id,
              destination_id: destinationId,
              package_name: packageName || "My Travel Package",
              package_group_id: currentPackageGroup.id
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
      setUserPackages(prev => prev.filter(id => id !== destinationId));
      
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
      if (hasActiveBooking) {
        toast({
          title: "Booking limit reached",
          description: "You already have an active booking. Please cancel it or wait until it's completed to book another VR experience.",
          variant: "destructive"
        });
        throw new Error("User already has an active booking");
      }
      
      const id = Math.random().toString(36).substring(2, 9);
      const createdAt = new Date().toISOString();
      
      const newBooking: VRBooking = {
        ...booking,
        id,
        createdAt,
      };
      
      setBookings(prev => [...prev, newBooking]);
      setHasActiveBooking(true);
      
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
      
      if (!(error instanceof Error && error.message === "User already has an active booking")) {
        toast({
          title: "Booking failed",
          description: "There was an error creating your booking",
          variant: "destructive"
        });
      }
      throw error;
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'cancelled' } 
            : booking
        )
      );
      
      const updatedBookings = bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' } 
          : booking
      );
      
      const stillHasActiveBooking = updatedBookings.some(booking => 
        booking.id !== bookingId && 
        booking.status !== 'cancelled' && 
        booking.status !== 'completed'
      );
      
      setHasActiveBooking(stillHasActiveBooking);
      
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
        packageGroups,
        currentPackageGroup,
        addToPackage,
        removeFromPackage,
        createVRBooking,
        cancelBooking,
        isInPackage,
        requestQuote,
        createPackageGroup,
        setCurrentPackageGroup,
        hasActiveBooking
      }}
    >
      {children}
    </TravelContext.Provider>
  );
};
