
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import DestinationCard from '@/components/destinations/DestinationCard';
import VideoModal from '@/components/destinations/VideoModal';
import { destinations } from '@/data/destinations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe, Search } from 'lucide-react';

const Destinations = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  
  const handleOpenVideo = (url: string) => {
    setVideoUrl(url);
    setIsVideoModalOpen(true);
  };
  
  const handleCloseVideo = () => {
    setIsVideoModalOpen(false);
  };
  
  const filteredDestinations = destinations.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dest.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dest.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRegion = selectedRegion === '' || dest.location.includes(selectedRegion);
    
    return matchesSearch && matchesRegion;
  });
  
  const regions = Array.from(new Set(destinations.map(dest => {
    // Extract the country/region from the location
    const parts = dest.location.split(',');
    return parts[parts.length - 1].trim();
  })));

  return (
    <MainLayout>
      <section className="relative py-16 md:py-24 bg-muted">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore Destinations
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover amazing places around the world in virtual reality before planning your trip.
              Experience the sights and sounds of your dream destinations from the comfort of your home.
            </p>
          </div>
          
          <div className="bg-white shadow-subtle rounded-xl p-6 mb-12">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search destinations..."
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
                    <SelectItem value="">All Regions</SelectItem>
                    {regions.map(region => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedRegion('');
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
                  setSelectedRegion('');
                }}
              >
                View All Destinations
              </Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDestinations.map((destination) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  onOpenVideo={handleOpenVideo}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      
      <VideoModal 
        videoUrl={videoUrl} 
        isOpen={isVideoModalOpen}
        onClose={handleCloseVideo}
      />
    </MainLayout>
  );
};

export default Destinations;
