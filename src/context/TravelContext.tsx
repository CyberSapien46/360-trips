
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from './AuthContext';
import axios from 'axios';

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

  // Check if user has active bookings
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

  // Load packages, package groups, and bookings when auth state changes
  useEffect(() => {
    const loadUserData = async () => {
      if (isAuthenticated && user) {
        try {
          // Load package groups
          const groupsRes = await axios.get('/packages/groups');
          
          if (groupsRes.data && groupsRes.data.length > 0) {
            const formattedGroups: PackageGroup[] = groupsRes.data.map((group: any) => ({
              id: group._id,
              name: group.name,
              createdAt: group.createdAt
            }));
            setPackageGroups(formattedGroups);
            
            // Set first group as current if none is selected
            if (!currentPackageGroup) {
              setCurrentPackageGroup(formattedGroups[0]);
            }
          } else {
            // Create a default package group if none exists
            if (isAuthenticated && user) {
              const defaultGroupName = "My Travel Packages";
              const newGroupRes = await axios.post('/packages/groups', { name: defaultGroupName });
              
              if (newGroupRes.data) {
                const formattedGroup: PackageGroup = {
                  id: newGroupRes.data._id,
                  name: newGroupRes.data.name,
                  createdAt: newGroupRes.data.createdAt
                };
                setPackageGroups([formattedGroup]);
                setCurrentPackageGroup(formattedGroup);
              }
            }
          }
          
          // Load packages
          const packageRes = await axios.get('/packages');
          
          if (packageRes.data && packageRes.data.length > 0) {
            const packages = packageRes.data.map((item: any) => item.destinationId);
            setUserPackages(packages);
          } else {
            // If no data in MongoDB, check localStorage as fallback
            const storedPackages = localStorage.getItem(`vr-travel-packages-${user.id}`);
            if (storedPackages) {
              setUserPackages(JSON.parse(storedPackages));
              
              // Migrate localStorage data to MongoDB
              const packagesToInsert = JSON.parse(storedPackages).map((destId: string) => ({
                destinationId: destId,
                packageName: "My Travel Package"
              }));
              
              if (packagesToInsert.length > 0) {
                for (const pkg of packagesToInsert) {
                  await axios.post('/packages', pkg);
                }
              }
            }
          }
          
          // Load bookings
          const bookingRes = await axios.get('/bookings');
          
          if (bookingRes.data) {
            // Convert from snake_case to camelCase
            const formattedBookings: VRBooking[] = bookingRes.data.map((booking: any) => ({
              id: booking._id,
              userId: booking.userId,
              date: booking.date,
              time: booking.time,
              address: booking.address,
              status: booking.status,
              createdAt: booking.createdAt,
              additionalNotes: booking.additionalNotes || undefined
            }));
            setBookings(formattedBookings);
            
            // Check if user has any active bookings
            const activeBooking = formattedBookings.some(booking => 
              booking.status !== 'cancelled' && booking.status !== 'completed'
            );
            setHasActiveBooking(activeBooking);
          } else {
            // If no data in MongoDB, check localStorage as fallback
            const storedBookings = localStorage.getItem(`vr-travel-bookings-${user.id}`);
            if (storedBookings) {
              const parsedBookings = JSON.parse(storedBookings);
              setBookings(parsedBookings);
              
              // Check if user has any active bookings
              const activeBooking = parsedBookings.some((booking: VRBooking) => 
                booking.status !== 'cancelled' && booking.status !== 'completed'
              );
              setHasActiveBooking(activeBooking);
              
              // Migrate localStorage bookings to MongoDB
              if (parsedBookings.length > 0) {
                for (const booking of parsedBookings) {
                  await axios.post('/bookings', {
                    date: booking.date,
                    time: booking.time,
                    address: booking.address,
                    additionalNotes: booking.additionalNotes
                  });
                }
              }
            }
          }
        } catch (error) {
          console.error('Error loading user data:', error);
          toast({
            description: "Failed to load your travel data",
            variant: "destructive"
          });
          
          // Fallback to localStorage if MongoDB fails
          const storedPackages = localStorage.getItem(`vr-travel-packages-${user.id}`);
          const storedBookings = localStorage.getItem(`vr-travel-bookings-${user.id}`);
          
          if (storedPackages) {
            setUserPackages(JSON.parse(storedPackages));
          }
          
          if (storedBookings) {
            const parsedBookings = JSON.parse(storedBookings);
            setBookings(parsedBookings);
            
            // Check if user has any active bookings
            const activeBooking = parsedBookings.some((booking: VRBooking) => 
              booking.status !== 'cancelled' && booking.status !== 'completed'
            );
            setHasActiveBooking(activeBooking);
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
          const parsedBookings = JSON.parse(storedBookings);
          setBookings(parsedBookings);
          
          // Check if user has any active bookings
          const activeBooking = parsedBookings.some((booking: VRBooking) => 
            booking.status !== 'cancelled' && booking.status !== 'completed'
          );
          setHasActiveBooking(activeBooking);
        }
      }
    };
    
    loadUserData();
  }, [isAuthenticated, user, currentPackageGroup]);

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

  const createPackageGroup = async (name: string) => {
    if (!isAuthenticated || !user) {
      toast({
        description: "You need to be logged in to create a package group",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const res = await axios.post('/packages/groups', { name });
      
      if (res.data) {
        const newGroup: PackageGroup = {
          id: res.data._id,
          name: res.data.name,
          createdAt: res.data.createdAt
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
        // Check if we have a current package group
        if (!currentPackageGroup && isAuthenticated && user) {
          // Create a default package group if none exists
          const defaultGroupName = "My Travel Packages";
          const newGroupRes = await axios.post('/packages/groups', { name: defaultGroupName });
          
          if (newGroupRes.data) {
            const formattedGroup: PackageGroup = {
              id: newGroupRes.data._id,
              name: newGroupRes.data.name,
              createdAt: newGroupRes.data.createdAt
            };
            setPackageGroups([formattedGroup]);
            setCurrentPackageGroup(formattedGroup);
          }
        }
        
        // Update local state first for immediate UI feedback
        setUserPackages(prev => [...prev, destinationId]);
        
        // If authenticated, store in MongoDB
        if (isAuthenticated && user && currentPackageGroup) {
          await axios.post('/packages', { 
            destinationId,
            packageName: packageName || "My Travel Package",
            packageGroupId: currentPackageGroup.id
          });
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
      
      // If authenticated, remove from MongoDB
      if (isAuthenticated && user) {
        await axios.delete(`/packages/${destinationId}`);
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
      // Check if user already has an active booking
      if (hasActiveBooking) {
        toast({
          title: "Booking limit reached",
          description: "You already have an active booking. Please cancel it or wait until it's completed to book another VR experience.",
          variant: "destructive"
        });
        throw new Error("User already has an active booking");
      }
      
      // If authenticated, store in MongoDB
      if (isAuthenticated && user) {
        const res = await axios.post('/bookings', {
          date: booking.date,
          time: booking.time,
          address: booking.address,
          additionalNotes: booking.additionalNotes
        });
        
        if (res.data) {
          const newBooking: VRBooking = {
            id: res.data._id,
            userId: res.data.userId,
            date: res.data.date,
            time: res.data.time,
            address: res.data.address,
            status: res.data.status,
            createdAt: res.data.createdAt,
            additionalNotes: res.data.additionalNotes
          };
          
          // Update local state
          setBookings(prev => [...prev, newBooking]);
          setHasActiveBooking(true);
          
          toast({
            title: "Booking confirmed",
            description: "Your VR experience has been booked successfully",
          });
        }
      } else {
        // For non-authenticated users, store in localStorage
        const id = Math.random().toString(36).substring(2, 9);
        const createdAt = new Date().toISOString();
        
        const newBooking: VRBooking = {
          ...booking,
          id,
          createdAt,
        };
        
        setBookings(prev => [...prev, newBooking]);
        setHasActiveBooking(true);
        
        toast({
          title: "Booking confirmed",
          description: "Your VR experience has been booked successfully",
        });
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      
      // Don't show toast here as we already show one for the booking limit
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
      // Update local state first for immediate UI feedback
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'cancelled' } 
            : booking
        )
      );
      
      // Update hasActiveBooking state
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
      
      // If authenticated, update in MongoDB
      if (isAuthenticated && user) {
        await axios.put(`/bookings/cancel/${bookingId}`);
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
      // In a real app, we would have an API endpoint for this
      // For now, we'll just show a success toast
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
