
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  CalendarDays, 
  Clock, 
  Hotel, 
  CheckCircle, 
  Map, 
  Star, 
  X,
  MapPin,
  IndianRupee
} from 'lucide-react';
import { useTravel } from '@/context/TravelContext';
import { DestinationWithTourDetails } from '@/data/destinations';

interface DestinationDetailsProps {
  destination: DestinationWithTourDetails;
  onClose: () => void;
  onAddToPackage: () => void;
  inPackage: boolean;
}

const DestinationDetails: React.FC<DestinationDetailsProps> = ({
  destination,
  onClose,
  onAddToPackage,
  inPackage
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-xl overflow-hidden shadow-xl">
        <div className="relative">
          <div 
            className="h-64 w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${destination.imageUrl})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
            onClick={onClose}
          >
            <X size={24} />
          </Button>
          <div className="absolute bottom-4 left-6 text-white">
            <h1 className="text-3xl font-bold mb-1">{destination.name}</h1>
            <div className="flex items-center space-x-2">
              <MapPin size={16} />
              <span>{destination.location}</span>
              <div className="flex items-center ml-2 bg-amber-400/90 text-amber-900 px-2 py-0.5 rounded-full">
                <Star size={14} className="mr-1" />
                <span className="font-medium">{destination.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-16rem)]">
          <div className="flex flex-wrap gap-4 mb-6">
            <Card className="flex-1 min-w-[200px]">
              <CardContent className="p-4 flex items-center space-x-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{destination.duration}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="flex-1 min-w-[200px]">
              <CardContent className="p-4 flex items-center space-x-3">
                <Hotel className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Accommodation</p>
                  <p className="font-medium line-clamp-1">{destination.accommodation}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="flex-1 min-w-[200px]">
              <CardContent className="p-4 flex items-center space-x-3">
                <IndianRupee className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-medium">₹{destination.price.toLocaleString('en-IN')}</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">Tour Description</h2>
            <p className="text-muted-foreground">{destination.description}</p>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-3">Tour Highlights</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {destination.tourHighlights.map((highlight, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-3">Inclusions</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {destination.inclusions.map((inclusion, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{inclusion}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h2 className="text-lg font-medium mb-3">Itinerary</h2>
            <div className="space-y-4">
              {destination.itinerary.map((day, index) => (
                <Card key={index} className="relative overflow-hidden border-l-4 border-primary">
                  <CardContent className="p-4">
                    <div className="flex items-center mb-2">
                      <CalendarDays className="h-5 w-5 text-primary mr-2" />
                      <h3 className="font-medium">Day {day.day}: {day.title}</h3>
                    </div>
                    <p className="text-muted-foreground">{day.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t flex justify-between items-center bg-muted/30">
          <div>
            <p className="text-sm text-muted-foreground">Tour package price</p>
            <p className="text-xl font-semibold text-primary">₹{destination.price.toLocaleString('en-IN')} <span className="text-sm font-normal text-muted-foreground">per person</span></p>
          </div>
          <Button 
            onClick={onAddToPackage}
            disabled={inPackage}
            size="lg"
            className="gap-2"
          >
            {inPackage ? (
              <>
                <CheckCircle size={18} />
                Added to Package
              </>
            ) : (
              <>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
                Add to Package
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetails;
