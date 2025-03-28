
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Compass, Headphones, Globe } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { destinations } from '@/data/destinations';

const Home = () => {
  const featuredDestinations = destinations.slice(0, 3);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20" />
        </div>
        
        <div className="container relative z-10 text-white">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-slide-in">
              Experience the World in Virtual Reality
            </h1>
            <p className="text-xl opacity-90 mb-8 animate-slide-in" style={{ animationDelay: '100ms' }}>
              Explore destinations in immersive VR before planning your next adventure. 
              See it, feel it, then book it.
            </p>
            <div className="space-x-4 animate-slide-in" style={{ animationDelay: '200ms' }}>
              <Button asChild size="lg" className="rounded-full px-8">
                <Link to="/destinations">Explore Destinations</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/20">
                <Link to="/vr-booking">Book VR Setup</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Destinations */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Popular VR Destinations
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our most requested virtual reality travel experiences.
              Preview these amazing locations before planning your trip.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {featuredDestinations.map((destination, index) => (
              <div 
                key={destination.id}
                className="bg-white rounded-xl overflow-hidden shadow-subtle transition-all duration-500 hover:shadow-elevation hover-scale"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div 
                  className="h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url(${destination.imageUrl})` }}
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{destination.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{destination.location}</p>
                  <p className="mb-4 line-clamp-2">{destination.description}</p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to={`/destinations`}>
                      View Experience
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Button asChild size="lg">
              <Link to="/destinations">
                View All Destinations
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              How 360 Trips Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our unique approach combines cutting-edge VR technology with travel planning
              to give you the most immersive pre-travel experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Compass className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Explore in VR</h3>
              <p className="text-muted-foreground">
                Browse our catalog of destinations and experience them in stunning 360° virtual reality.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Headphones className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Book VR Setup</h3>
              <p className="text-muted-foreground">
                Schedule a VR session at your home with our premium equipment for the most immersive experience.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Plan Your Trip</h3>
              <p className="text-muted-foreground">
                Add destinations to your package and our travel experts will help plan your perfect journey.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="container">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Experience Travel in VR?
            </h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Book a VR session today or explore our destination catalog to find your next dream vacation.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" variant="secondary" className="rounded-full px-8">
                <Link to="/destinations">Explore Destinations</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-8 bg-transparent border-white/60 text-white hover:bg-white/10">
                <Link to="/vr-booking">Book VR Experience</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              What Our Customers Say
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear from travelers who used our VR experiences to plan their perfect vacations.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-subtle">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary font-semibold">JD</span>
                </div>
                <div>
                  <h4 className="font-semibold">John Doe</h4>
                  <p className="text-sm text-muted-foreground">Visited Bali, Indonesia</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                "The VR experience was incredibly detailed. I felt like I was actually walking on the beaches of Bali before booking my trip. It made planning so much easier!"
              </p>
              <div className="flex text-amber-500">
                {Array(5).fill(0).map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-subtle">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary font-semibold">SJ</span>
                </div>
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-sm text-muted-foreground">Visited Santorini, Greece</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                "I was able to virtually visit three different Greek islands before deciding on Santorini. The VR experience helped me make the right choice for my honeymoon."
              </p>
              <div className="flex text-amber-500">
                {Array(5).fill(0).map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-subtle">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary font-semibold">RM</span>
                </div>
                <div>
                  <h4 className="font-semibold">Robert Martinez</h4>
                  <p className="text-sm text-muted-foreground">Visited Kyoto, Japan</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                "Having the VR equipment set up at my home was convenient and the experience was mind-blowing. It helped me plan my itinerary for Japan perfectly."
              </p>
              <div className="flex text-amber-500">
                {Array(5).fill(0).map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={i < 4 ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
