
import React, { useState, useEffect } from 'react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Globe, Search, Filter } from 'lucide-react';

// Exchange rate: 1 USD = approximately 83 INR (as of mid-2024)
const USD_TO_INR = 83;

const Destinations = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [videoUrl, setVideoUrl] = useState('');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'rating' | 'relevant'>('relevant');
  
  const handleOpenVideo = (url: string) => {
    setVideoUrl(url);
    setIsVideoModalOpen(true);
  };
  
  const handleCloseVideo = () => {
    setIsVideoModalOpen(false);
  };
  
  // Extract unique countries from location information
  const countries = Array.from(new Set(destinations.map(dest => {
    const parts = dest.location.split(',');
    return parts[parts.length - 1].trim();
  }))).sort();
  
  // Filter destinations based on search query and selected region
  let filteredDestinations = destinations.filter(dest => {
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

  // Count destinations by country for display in filter dropdown
  const countryCount = countries.reduce((acc, country) => {
    const count = destinations.filter(d => d.location.includes(country)).length;
    acc[country] = count;
    return acc;
  }, {} as Record<string, number>);

  // Convert USD price to INR for display
  const convertToINR = (priceUSD: number) => {
    return Math.round(priceUSD * USD_TO_INR);
  };

  return (
    <MainLayout>
      <section className="relative py-16 md:py-24 bg-muted">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore Dream Destinations
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience international and domestic destinations in virtual reality before booking your trip.
              Travel smart by previewing your dream locations from the comfort of your home.
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
                    <SelectItem value="all">All Regions ({destinations.length})</SelectItem>
                    {countries.map(country => (
                      <SelectItem key={country} value={country}>
                        {country} ({countryCount[country]})
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
                    destination={{
                      ...destination,
                      priceDisplay: `₹${convertToINR(destination.price).toLocaleString('en-IN')}`
                    }}
                    onOpenVideo={handleOpenVideo}
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
    </MainLayout>
  );
};

export default Destinations;
