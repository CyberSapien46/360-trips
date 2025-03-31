
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

// Types
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

export interface Booking {
  id: string;
  date: string;
  time: string;
  address: string;
  status: string;
  additionalNotes?: string;
}

export interface PackageGroup {
  id: string;
  name: string;
  userId: string;
}

interface TravelContextType {
  userPackages: string[];
  packageGroups: PackageGroup[];
  currentPackageGroup: PackageGroup | null;
  bookings: Booking[];
  hasActiveBooking: boolean;
  setCurrentPackageGroup: (group: PackageGroup) => void;
  addToPackage: (destinationId: string) => void;
  removeFromPackage: (destinationId: string) => void;
  isInPackage: (destinationId: string) => boolean;
  createPackageGroup: (name: string) => Promise<void>;
  requestQuote: () => Promise<void>;
  createBooking: (bookingData: Omit<Booking, 'id' | 'status'>) => Promise<void>;
  createVRBooking: (bookingData: any) => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;
}

// Context
const TravelContext = createContext<TravelContextType | undefined>(undefined);

// Provider
export const TravelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  
  const [userPackages, setUserPackages] = useState<string[]>([]);
  const [packageGroups, setPackageGroups] = useState<PackageGroup[]>([]);
  const [currentPackageGroup, setCurrentPackageGroup] = useState<PackageGroup | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [hasActiveBooking, setHasActiveBooking] = useState(false);

  // Load user's packages
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserPackages();
      fetchPackageGroups();
      fetchBookings();
    } else {
      setUserPackages([]);
      setPackageGroups([]);
      setBookings([]);
      setHasActiveBooking(false);
    }
  }, [isAuthenticated, user]);

  // Check for active bookings whenever bookings change
  useEffect(() => {
    // Check if user has any active bookings (not cancelled or completed)
    const active = bookings.some(booking => 
      booking.status !== 'cancelled' && booking.status !== 'completed'
    );
    setHasActiveBooking(active);
  }, [bookings]);

  const fetchUserPackages = async () => {
    try {
      const res = await axios.get('/api/packages');
      setUserPackages(res.data.map((pkg: any) => pkg.destinationId));
    } catch (err) {
      console.error('Error fetching user packages:', err);
    }
  };

  const fetchPackageGroups = async () => {
    try {
      const res = await axios.get('/api/packages/groups');
      setPackageGroups(res.data.map((group: any) => ({
        id: group._id,
        name: group.name,
        userId: group.userId
      })));
      
      if (res.data.length > 0 && !currentPackageGroup) {
        setCurrentPackageGroup({
          id: res.data[0]._id,
          name: res.data[0].name,
          userId: res.data[0].userId
        });
      }
    } catch (err) {
      console.error('Error fetching package groups:', err);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get('/api/bookings');
      setBookings(res.data.map((booking: any) => ({
        id: booking._id,
        date: booking.date,
        time: booking.time,
        address: booking.address,
        status: booking.status,
        additionalNotes: booking.additionalNotes
      })));
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  const addToPackage = async (destinationId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to add destinations to your package",
      });
      return;
    }

    try {
      const packageData = {
        destinationId,
        packageGroupId: currentPackageGroup?.id
      };
      
      await axios.post('/api/packages', packageData);
      setUserPackages(prev => [...prev, destinationId]);
      
      toast({
        description: `Added to your travel package`,
      });
    } catch (err) {
      console.error('Error adding to package:', err);
      toast({
        title: "Error",
        description: "Failed to add destination to package",
        variant: "destructive"
      });
    }
  };

  const removeFromPackage = async (destinationId: string) => {
    try {
      // Find the package with this destination
      const res = await axios.get('/api/packages');
      const packageToRemove = res.data.find((pkg: any) => pkg.destinationId === destinationId);
      
      if (packageToRemove) {
        await axios.delete(`/api/packages/${packageToRemove._id}`);
        setUserPackages(prev => prev.filter(id => id !== destinationId));
        
        toast({
          description: `Removed from your travel package`,
        });
      }
    } catch (err) {
      console.error('Error removing from package:', err);
      toast({
        title: "Error",
        description: "Failed to remove destination from package",
        variant: "destructive"
      });
    }
  };

  const isInPackage = (destinationId: string): boolean => {
    return userPackages.includes(destinationId);
  };

  const createPackageGroup = async (name: string): Promise<void> => {
    try {
      const res = await axios.post('/api/packages/groups', { name });
      const newGroup = {
        id: res.data._id,
        name: res.data.name,
        userId: res.data.userId
      };
      
      setPackageGroups(prev => [...prev, newGroup]);
      setCurrentPackageGroup(newGroup);
      
      toast({
        description: `Created new package group: ${name}`,
      });
    } catch (err) {
      console.error('Error creating package group:', err);
      toast({
        title: "Error",
        description: "Failed to create package group",
        variant: "destructive"
      });
      throw err;
    }
  };

  const requestQuote = async (): Promise<void> => {
    try {
      await axios.post('/api/quotes', { packageIds: userPackages });
      
      toast({
        title: "Quote Request Submitted",
        description: "We'll get back to you with a customized quote soon!",
      });
    } catch (err) {
      console.error('Error requesting quote:', err);
      toast({
        title: "Error",
        description: "Failed to submit quote request",
        variant: "destructive"
      });
      throw err;
    }
  };

  const createBooking = async (bookingData: Omit<Booking, 'id' | 'status'>): Promise<void> => {
    try {
      const res = await axios.post('/api/bookings', bookingData);
      
      const newBooking: Booking = {
        id: res.data._id,
        date: res.data.date,
        time: res.data.time,
        address: res.data.address,
        status: res.data.status,
        additionalNotes: res.data.additionalNotes
      };
      
      setBookings(prev => [...prev, newBooking]);
      
      toast({
        title: "Booking Confirmed",
        description: `Your VR experience has been scheduled for ${bookingData.date}`,
      });
    } catch (err) {
      console.error('Error creating booking:', err);
      toast({
        title: "Error",
        description: "Failed to create booking",
        variant: "destructive"
      });
      throw err;
    }
  };

  // Add missing createVRBooking method
  const createVRBooking = async (bookingData: any): Promise<void> => {
    try {
      const res = await axios.post('/api/bookings', {
        date: bookingData.date,
        time: bookingData.time,
        address: bookingData.address,
        additionalNotes: bookingData.additionalNotes
      });
      
      const newBooking: Booking = {
        id: res.data._id,
        date: res.data.date,
        time: res.data.time,
        address: res.data.address,
        status: res.data.status,
        additionalNotes: res.data.additionalNotes
      };
      
      setBookings(prev => [...prev, newBooking]);
      
      toast({
        title: "VR Booking Confirmed",
        description: `Your VR experience has been scheduled for ${bookingData.date}`,
      });
    } catch (err) {
      console.error('Error creating VR booking:', err);
      toast({
        title: "Error",
        description: "Failed to create VR booking",
        variant: "destructive"
      });
      throw err;
    }
  };

  const cancelBooking = async (bookingId: string): Promise<void> => {
    try {
      await axios.delete(`/api/bookings/${bookingId}`);
      setBookings(prev => prev.filter(booking => booking.id !== bookingId));
      
      toast({
        description: "Your booking has been cancelled",
      });
    } catch (err) {
      console.error('Error cancelling booking:', err);
      toast({
        title: "Error",
        description: "Failed to cancel booking",
        variant: "destructive"
      });
      throw err;
    }
  };

  return (
    <TravelContext.Provider
      value={{
        userPackages,
        packageGroups,
        currentPackageGroup,
        bookings,
        hasActiveBooking,
        setCurrentPackageGroup,
        addToPackage,
        removeFromPackage,
        isInPackage,
        createPackageGroup,
        requestQuote,
        createBooking,
        createVRBooking,
        cancelBooking
      }}
    >
      {children}
    </TravelContext.Provider>
  );
};

// Hook
export const useTravel = () => {
  const context = useContext(TravelContext);
  if (context === undefined) {
    throw new Error('useTravel must be used within a TravelProvider');
  }
  return context;
};
