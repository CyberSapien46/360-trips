
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '../hooks/use-toast';

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
};

type TravelContextType = {
  userPackages: string[];
  bookings: VRBooking[];
  addToPackage: (destinationId: string) => void;
  removeFromPackage: (destinationId: string) => void;
  createVRBooking: (booking: Omit<VRBooking, 'id' | 'createdAt'>) => void;
  cancelBooking: (bookingId: string) => void;
  isInPackage: (destinationId: string) => boolean;
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
  const [userPackages, setUserPackages] = useState<string[]>([]);
  const [bookings, setBookings] = useState<VRBooking[]>([]);

  useEffect(() => {
    // Load from localStorage if available
    const storedPackages = localStorage.getItem('vr-travel-packages');
    const storedBookings = localStorage.getItem('vr-travel-bookings');
    
    if (storedPackages) {
      setUserPackages(JSON.parse(storedPackages));
    }
    
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('vr-travel-packages', JSON.stringify(userPackages));
  }, [userPackages]);

  useEffect(() => {
    localStorage.setItem('vr-travel-bookings', JSON.stringify(bookings));
  }, [bookings]);

  const addToPackage = (destinationId: string) => {
    if (!userPackages.includes(destinationId)) {
      setUserPackages(prev => [...prev, destinationId]);
      toast({
        title: "Added to package",
        description: "Destination has been added to your travel package",
      });
    } else {
      toast({
        description: "This destination is already in your package",
      });
    }
  };

  const removeFromPackage = (destinationId: string) => {
    setUserPackages(prev => prev.filter(id => id !== destinationId));
    toast({
      description: "Destination has been removed from your package",
    });
  };

  const isInPackage = (destinationId: string) => {
    return userPackages.includes(destinationId);
  };

  const createVRBooking = (booking: Omit<VRBooking, 'id' | 'createdAt'>) => {
    const newBooking: VRBooking = {
      ...booking,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
    };
    
    setBookings(prev => [...prev, newBooking]);
    
    toast({
      title: "Booking confirmed",
      description: "Your VR experience has been booked successfully",
    });
  };

  const cancelBooking = (bookingId: string) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' } 
          : booking
      )
    );
    
    toast({
      description: "Your booking has been cancelled",
    });
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
      }}
    >
      {children}
    </TravelContext.Provider>
  );
};
