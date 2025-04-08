
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Separator } from "@/components/ui/separator";
import { Handshake, Building2, Globe, Hotel, CreditCard, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Partnerships = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-12 px-4">
        <div className="flex items-center gap-3 mb-6">
          <Handshake className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Partner With Us</h1>
        </div>
        <Separator className="mb-8" />
        
        <div className="max-w-4xl mb-12">
          <p className="text-xl text-gray-600 mb-6">
            360° Trips partners with tourism boards, hotels, resorts, tour operators, and technology providers 
            to create immersive virtual reality experiences and deliver unforgettable travel adventures across India.
          </p>
          <p className="text-gray-600">
            Join our network of trusted partners and grow your business while helping travelers experience 
            the beauty of India through innovative virtual reality technology.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {[
            {
              title: "Tourism Boards",
              icon: <Globe className="h-10 w-10 text-primary mb-4" />,
              description: "Partner with us to showcase your region's attractions in stunning VR and drive tourism to your area."
            },
            {
              title: "Hotels & Resorts",
              icon: <Hotel className="h-10 w-10 text-primary mb-4" />,
              description: "Feature your property in our VR experiences and connect with travelers who have already explored your destination virtually."
            },
            {
              title: "Tour Operators",
              icon: <Building2 className="h-10 w-10 text-primary mb-4" />,
              description: "Integrate your tours into our platform and benefit from pre-qualified leads who have previewed experiences in VR."
            },
            {
              title: "Payment Partners",
              icon: <CreditCard className="h-10 w-10 text-primary mb-4" />,
              description: "Provide seamless payment solutions for our customers booking experiences and travel packages."
            },
            {
              title: "Technology Providers",
              icon: <Headphones className="h-10 w-10 text-primary mb-4" />,
              description: "Supply VR hardware, software solutions, or other technology that enhances our immersive travel experiences."
            }
          ].map((partner, index) => (
            <Card key={index} className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-center">{partner.icon}</div>
                <CardTitle className="text-xl text-center">{partner.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600">{partner.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 mb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Why Partner With 360° Trips?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-3">Increased Visibility</h3>
                <p className="text-gray-600">
                  Showcase your destination, property, or service to our growing user base of travel enthusiasts.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Higher Conversion Rates</h3>
                <p className="text-gray-600">
                  Connect with travelers who have already experienced your offering virtually and are more likely to book.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Innovative Marketing</h3>
                <p className="text-gray-600">
                  Leverage cutting-edge VR technology to differentiate your offering in a competitive market.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Data Insights</h3>
                <p className="text-gray-600">
                  Gain valuable information about traveler preferences and behavior through our analytics.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Become a Partner Today</h2>
          <p className="text-gray-600 mb-8">
            Interested in partnering with 360° Trips? Fill out our partnership inquiry form, and our team will 
            contact you to discuss how we can collaborate to create amazing travel experiences.
          </p>
          <Button size="lg" className="px-8">
            Apply for Partnership
          </Button>
        </div>
        
        <div className="mt-16 pt-8 border-t">
          <h3 className="text-xl font-semibold mb-6">Current Partners</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {['Incredible India', 'Tourism Authority of Kerala', 'Rajasthan Tourism', 'Indian Railways', 'Taj Hotels', 'Make My Trip'].map((partner, index) => (
              <div key={index} className="flex items-center justify-center h-20 bg-gray-100 rounded-lg">
                <span className="font-medium text-gray-700">{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Partnerships;
