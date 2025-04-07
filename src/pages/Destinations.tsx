
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import DestinationCard from '@/components/destinations/DestinationCard';
import VideoModal from '@/components/destinations/VideoModal';
import DestinationDetails from '@/components/destinations/DestinationDetails';
import { destinations, DestinationWithTourDetails } from '@/data/destinations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Globe, Search, Filter } from 'lucide-react';
import { useTravel } from '@/context/TravelContext';

const Destinations = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [videoUrl, setVideoUrl] = useState('');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'rating' | 'relevant'>('relevant');
  const [selectedDestination, setSelectedDestination] = useState<DestinationWithTourDetails | null>(null);
  const { addToPackage, isInPackage } = useTravel();
  
  // Filter to only Indian destinations
  const indianDestinations = destinations.filter(dest => 
    dest.location.toLowerCase().includes('india')
  );
  
  const handleOpenVideo = (url: string) => {
    setVideoUrl(url);
    setIsVideoModalOpen(true);
  };
  
  const handleCloseVideo = () => {
    setIsVideoModalOpen(false);
  };

  const handleViewDetails = (destination: DestinationWithTourDetails) => {
    setSelectedDestination(destination);
  };

  const handleCloseDetails = () => {
    setSelectedDestination(null);
  };
  
  const handleAddToPackage = () => {
    if (selectedDestination) {
      addToPackage(selectedDestination.id);
    }
  };
  
  // Extract unique regions from location information
  const regions = Array.from(new Set(indianDestinations.map(dest => {
    const parts = dest.location.split(',');
    if (parts.length > 1) {
      return parts[parts.length - 2].trim();
    }
    return "Other";
  }))).filter(Boolean).sort();
  
  // Filter destinations based on search query and selected region
  let filteredDestinations = indianDestinations.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dest.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dest.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRegion = selectedRegion === 'all' || 
                          dest.location.split(',').map(part => part.trim()).includes(selectedRegion) ||
                          dest.location.includes(selectedRegion);
    
    return matchesSearch && matchesRegion;
  });
  
  // Sort filtered destinations based on selected sort method
  if (sortBy) {
    filteredDestinations = [...filteredDestinations].sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }

  // Count destinations by region for display in filter dropdown
  const regionCount = regions.reduce((acc, region) => {
    const count = indianDestinations.filter(d => d.location.includes(region)).length;
    acc[region] = count;
    return acc;
  }, {} as Record<string, number>);

  return (
    <MainLayout>
      <section className="relative py-16 md:py-24 bg-muted">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore Incredible India
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience the diversity of Indian destinations in virtual reality before booking your trip.
              From majestic mountains to serene beaches, ancient temples to vibrant cities.
            </p>
          </div>
          
          <div className="bg-white shadow-subtle rounded-xl p-6 mb-12">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search destinations by name or location..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="w-full md:w-64">
                <Select 
                  value={selectedRegion} 
                  onValueChange={setSelectedRegion}
                >
                  <SelectTrigger>
                    <div className="flex items-center">
                      <Globe className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="All Regions" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions ({indianDestinations.length})</SelectItem>
                    {regions.map(region => (
                      <SelectItem key={region} value={region}>
                        {region} ({regionCount[region] || 0})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-64">
                <Select 
                  value={sortBy} 
                  onValueChange={(value: 'price-low' | 'price-high' | 'rating' | 'relevant') => setSortBy(value)}
                >
                  <SelectTrigger>
                    <div className="flex items-center">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Sort by" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevant">Most Popular</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedRegion('all');
                  setSortBy('relevant');
                }}
                variant="outline"
                className="md:w-auto"
              >
                Reset Filters
              </Button>
            </div>
          </div>
          
          {filteredDestinations.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-medium mb-2">No destinations found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search criteria or browse all destinations.
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedRegion('all');
                  setSortBy('relevant');
                }}
              >
                View All Destinations
              </Button>
            </div>
          ) : (
            <>
              <Alert className="mb-6" variant="default">
                <AlertDescription>
                  Showing {filteredDestinations.length} {filteredDestinations.length === 1 ? 'destination' : 'destinations'}
                  {selectedRegion !== 'all' ? ` in ${selectedRegion}` : ''}
                  {sortBy !== 'relevant' ? ` sorted by ${sortBy.replace('-', ' ')}` : ''}
                </AlertDescription>
              </Alert>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredDestinations.map((destination) => (
                  <DestinationCard
                    key={destination.id}
                    destination={destination}
                    onOpenVideo={handleOpenVideo}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      
      <VideoModal 
        videoUrl={videoUrl} 
        isOpen={isVideoModalOpen}
        onClose={handleCloseVideo}
      />

      {selectedDestination && (
        <DestinationDetails 
          destination={selectedDestination}
          onClose={handleCloseDetails}
          onAddToPackage={handleAddToPackage}
          inPackage={isInPackage(selectedDestination.id)}
        />
      )}
    </MainLayout>
  );
};

export default Destinations;
