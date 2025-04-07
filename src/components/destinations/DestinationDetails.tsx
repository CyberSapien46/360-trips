
import React, { useState } from 'react';
import { X, MapPin, Calendar, Clock, IndianRupee, Check, Plus, Star, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DestinationWithTourDetails } from '@/data/destinations';
import ReviewSection from './ReviewSection';
import PanoramaViewer from './PanoramaViewer';

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
  inPackage,
}) => {
  const [view, setView] = useState<'regular' | '360'>('regular');
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">{destination.name}</DialogTitle>
              <DialogDescription className="flex items-center mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {destination.location}
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full mt-[-0.5rem] mr-[-0.5rem]"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="overview" className="px-6 mt-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="360view">360° View</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[calc(90vh-12rem)] mt-4 pb-6">
            <TabsContent value="overview" className="pt-2">
              <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden mb-6">
                <img
                  src={destination.imageUrl}
                  alt={destination.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-muted/50 p-4 rounded-lg text-center">
                  <Calendar className="mx-auto h-5 w-5 mb-2 text-primary" />
                  <p className="text-sm font-medium">{destination.duration}</p>
                  <p className="text-xs text-muted-foreground">Duration</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg text-center">
                  <IndianRupee className="mx-auto h-5 w-5 mb-2 text-primary" />
                  <p className="text-sm font-medium">₹{destination.price.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-muted-foreground">Per Person</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg text-center">
                  <Star className="mx-auto h-5 w-5 mb-2 text-amber-500" />
                  <p className="text-sm font-medium">{destination.rating.toFixed(1)}/5</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">About this destination</h3>
                <p>{destination.description}</p>
                {destination.accommodation && (
                  <>
                    <h3 className="text-lg font-medium">Accommodation</h3>
                    <p>{destination.accommodation}</p>
                  </>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="inclusions" className="pt-2">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">What's Included</h3>
                <ul className="space-y-2">
                  {destination.inclusions?.map((inclusion, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{inclusion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="itinerary" className="pt-2">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Detailed Itinerary</h3>
                <div className="space-y-6">
                  {destination.itinerary?.map((day) => (
                    <div key={day.day} className="relative pl-8 pb-6">
                      <div className="absolute left-0 top-0 h-full w-px bg-border"></div>
                      <div className="absolute left-[-8px] top-1 h-4 w-4 rounded-full bg-primary"></div>
                      <h4 className="font-medium">Day {day.day}: {day.title}</h4>
                      <p className="mt-2 text-muted-foreground">{day.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="360view" className="pt-2">
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">360° Panoramic Experience</h3>
                  <div className="text-sm text-muted-foreground flex items-center">
                    <span className="mr-2">Drag to explore</span>
                    <Compass className="h-4 w-4" />
                  </div>
                </div>
                
                <div className="bg-muted/20 rounded-lg p-4 text-muted-foreground mb-4">
                  <p className="text-sm">
                    Use your mouse or touch to look around in 360°. Scroll to zoom in and out.
                    Experience {destination.name} as if you were actually there!
                  </p>
                </div>
                
                <PanoramaViewer 
                  imageUrl={destination.panoramaUrl || destination.imageUrl} 
                  className="h-[400px] mb-6 shadow-lg"
                />
                
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Key Viewpoints</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((point) => (
                      <div 
                        key={point}
                        className="aspect-square bg-muted rounded-md overflow-hidden cursor-pointer hover:ring-2 ring-primary transition-all"
                        onClick={() => console.log(`Viewpoint ${point} clicked`)}
                      >
                        <img 
                          src={destination.imageUrl} 
                          alt={`Viewpoint ${point}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="pt-2">
              <ReviewSection 
                destinationId={destination.id} 
                destinationName={destination.name} 
              />
            </TabsContent>
          </ScrollArea>
        </Tabs>
        
        <div className="p-6 border-t bg-card mt-auto">
          <Button
            className="w-full"
            onClick={onAddToPackage}
            disabled={inPackage}
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DestinationDetails;
