
import React, { useState, useEffect } from 'react';
import { Heart, Plus, Check, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useTravel, Destination } from '@/context/TravelContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { DestinationWithTourDetails } from '@/data/destinations';

interface DestinationCardProps {
  destination: DestinationWithTourDetails & { priceDisplay?: string };
  onOpenVideo: (url: string) => void;
  onViewDetails: (destination: DestinationWithTourDetails) => void;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ 
  destination,
  onOpenVideo,
  onViewDetails
}) => {
  const { isAuthenticated, user } = useAuth();
  const { addToPackage, isInPackage } = useTravel();
  const { toast } = useToast();
  const [liked, setLiked] = useState(false);
  
  const inPackage = isInPackage(destination.id);
  
  // Check if destination is in favorites when component mounts
  useEffect(() => {
    if (isAuthenticated && user) {
      const storedFavorites = localStorage.getItem(`vr-travel-favorites-${user.id}`);
      if (storedFavorites) {
        const favorites = JSON.parse(storedFavorites);
        setLiked(favorites.includes(destination.id));
      }
    }
  }, [isAuthenticated, user, destination.id]);
  
  const handleAddToPackage = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to add destinations to your package",
      });
      return;
    }
    
    addToPackage(destination.id);
  };
  
  const handleLike = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to add destinations to your favourites",
      });
      return;
    }
    
    const newLikedState = !liked;
    setLiked(newLikedState);
    
    // Save to localStorage
    const storedFavorites = localStorage.getItem(`vr-travel-favorites-${user!.id}`) || '[]';
    let favorites = JSON.parse(storedFavorites);
    
    if (newLikedState) {
      // Add to favorites if not already there
      if (!favorites.includes(destination.id)) {
        favorites.push(destination.id);
      }
    } else {
      // Remove from favorites
      favorites = favorites.filter((id: string) => id !== destination.id);
    }
    
    localStorage.setItem(`vr-travel-favorites-${user!.id}`, JSON.stringify(favorites));
    
    toast({
      description: newLikedState 
        ? `Added ${destination.name} to favourites` 
        : `Removed ${destination.name} from favourites`,
    });
  };
  
  return (
    <Card className="overflow-hidden h-full hover-scale glass-card transition-all">
      <div 
        className="h-48 bg-cover bg-center cursor-pointer relative group"
        style={{ backgroundImage: `url(${destination.imageUrl})` }}
        onClick={() => onOpenVideo(destination.videoUrl)}
      >
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="bg-white/90 rounded-full p-3 transform scale-90 group-hover:scale-100 transition-transform">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              className="text-primary"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </div>
        <div className="absolute top-2 right-2">
          <Button 
            size="icon" 
            variant="ghost" 
            className={`rounded-full bg-white/80 hover:bg-white backdrop-blur-sm ${
              liked ? 'text-red-500' : 'text-gray-700'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
          >
            <Heart className={liked ? 'fill-current' : ''} size={18} />
          </Button>
        </div>
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-primary text-white text-xs rounded-full">
          {destination.duration}
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-medium text-lg line-clamp-1">{destination.name}</h3>
          <div className="flex items-center text-amber-500">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              stroke="currentColor" 
              strokeWidth="1"
              className="mr-1"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span className="text-sm">{destination.rating.toFixed(1)}</span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground mb-3 flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            className="mr-1"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {destination.location}
        </div>
        <p className="text-sm line-clamp-2 text-foreground/80 mb-2">
          {destination.description}
        </p>
        <div className="font-medium text-primary">
          {destination.priceDisplay || `₹${destination.price.toLocaleString('en-IN')}`} per person
        </div>
      </CardContent>
      <CardFooter className="px-4 pb-4 pt-0 flex flex-col space-y-2">
        <Button 
          onClick={() => onViewDetails(destination)}
          variant="secondary"
          className="w-full"
        >
          <Eye size={16} className="mr-2" />
          View Details
        </Button>
        <Button 
          onClick={handleAddToPackage}
          disabled={inPackage}
          className="w-full"
          variant={inPackage ? "outline" : "default"}
        >
          {inPackage ? (
            <>
              <Check size={16} className="mr-2" />
              Added to Package
            </>
          ) : (
            <>
              <Plus size={16} className="mr-2" />
              Add to Package
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DestinationCard;
