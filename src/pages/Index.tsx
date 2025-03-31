
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { GlobeIcon, MapPinIcon, Headphones } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
            Experience Before You Travel
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Explore international and domestic destinations in immersive virtual reality before booking your holiday. 
            Make informed decisions and plan the perfect trip from the comfort of your home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/destinations">Explore Destinations</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8">
              <Link to="/vr-booking">Book VR Demo</Link>
            </Button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: <GlobeIcon className="h-10 w-10 text-blue-500 mb-4" />,
              title: "Global Destinations",
              description: "Explore 50+ destinations worldwide including popular Indian traveler favorites like Dubai, Singapore, Thailand, and Europe."
            },
            {
              icon: <MapPinIcon className="h-10 w-10 text-blue-500 mb-4" />,
              title: "Domestic Wonders",
              description: "Discover incredible experiences across India from Kashmir to Kanyakumari, featuring hill stations, beaches, and cultural treasures."
            },
            {
              icon: <Headphones className="h-10 w-10 text-blue-500 mb-4" />,
              title: "Home VR Experience",
              description: "We bring the VR equipment to your doorstep in major Indian cities. Experience destinations before finalizing your travel plans."
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 text-center shadow-subtle transition-all hover:shadow-md">
              <div className="flex justify-center">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="bg-blue-50 rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready for an Amazing Journey?</h2>
            <p className="text-gray-600 mb-8">
              Get ₹2,000 off your first holiday package when you book a VR experience. 
              Preview your destinations and travel with confidence!
            </p>
            <Button asChild size="lg">
              <Link to="/signup">Sign Up Now</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
