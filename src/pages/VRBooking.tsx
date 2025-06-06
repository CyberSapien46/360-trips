
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import VRBookingForm from '@/components/booking/VRBookingForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Headphones, User, CheckCircle, Info, Compass } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const VRBooking = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [showAuthForm, setShowAuthForm] = useState(false);
  
  useEffect(() => {
    if (!isLoading) {
      setShowAuthForm(!isAuthenticated);
    }
  }, [isAuthenticated, isLoading]);

  return (
    <MainLayout>
      <section className="pt-16 pb-8 bg-muted/50">
        <div className="container">
          <div className="flex flex-col items-center text-center mb-8">
            <Headphones className="h-12 w-12 text-primary mb-4" />
            <h1 className="text-4xl font-bold mb-4">
              Experience Destinations in True VR
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Dive deeper than our online 360° views! Book a premium VR experience with equipment 
              delivered and set up at your doorstep by our trained technicians for the ultimate immersive preview.
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-12">
        <div className="container">
          <Alert className="mb-8 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-700">
              Users can only have one active VR booking at a time. You can book another session after your current booking is completed or if you cancel it.
            </AlertDescription>
          </Alert>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-subtle p-6 md:p-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Book Your In-Home VR Demo Session
                </h2>
                
                {isLoading ? (
                  <div className="py-10 text-center">
                    <p>Loading...</p>
                  </div>
                ) : isAuthenticated && user ? (
                  <VRBookingForm />
                ) : (
                  <div className="py-10 text-center">
                    <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">Login Required</h3>
                    <p className="text-muted-foreground mb-6">
                      You need to be logged in to book a VR experience.
                    </p>
                    <Button asChild>
                      <Link to="/login">Sign In to Continue</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Compass className="h-5 w-5 text-primary mr-2" />
                    Beyond 360° Views
                  </h3>
                  <p className="mb-4 text-muted-foreground">
                    While our online 360° tours give you a taste of your destinations, our in-home VR experience takes immersion 
                    to the next level with:
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Full spatial presence with depth perception",
                      "Interactive elements and guided exploration",
                      "High-resolution visuals on professional VR headsets",
                      "Spatial audio for complete immersion",
                      "No technical setup required - we handle everything"
                    ].map((item, index) => (
                      <li key={index} className="flex">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    What to Expect
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Professional setup of premium VR equipment at your home",
                      "A 2-hour guided virtual tour of your chosen destinations",
                      "Travel expert to answer queries about destinations",
                      "Assistance with holiday planning based on your experience",
                      "Special discounts on package bookings for experienced destinations"
                    ].map((item, index) => (
                      <li key={index} className="flex">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Booking Information
                  </h3>
                  <div className="space-y-3 text-sm">
                    <p><strong>Duration:</strong> 2 hours</p>
                    <p><strong>Price:</strong> ₹800 per session</p>
                    <p><strong>Availability:</strong> 7 days a week, 10am-8pm</p>
                    <p><strong>Equipment:</strong> All equipment provided</p>
                    <p><strong>Requirements:</strong> Minimum 10x10 ft clear space</p>
                    <p><strong>Limit:</strong> One active booking per user</p>
                    <p className="text-muted-foreground mt-4">
                      The fee will be fully refunded as travel credits if you book a holiday package within 30 days of your VR experience.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-primary text-white">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Not ready to book?
              </h2>
              <p className="text-primary-foreground/80 mb-6">
                You can also experience our destinations through our online 360° panoramas. 
                Visit our destinations page to explore now!
              </p>
              <Button asChild variant="secondary">
                <Link to="/destinations">Browse 360° Destinations</Link>
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-video rounded-lg overflow-hidden bg-black/20 backdrop-blur-sm">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/BRmiLCPQsAY?si=3MwzDLG8Q6LYuYnK"
                  title="VR Experience Preview"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default VRBooking;
